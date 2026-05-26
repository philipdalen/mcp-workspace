import { promises as fs } from "fs";
import * as os from "os";
import * as path from "path";
import { TokenCredential } from "@azure/identity";
import { Client, PageCollection } from "@microsoft/microsoft-graph-client";
import { Event, FileAttachment, Message, OutlookCategory, Calendar } from "@microsoft/microsoft-graph-types";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js";
import { JSDOM } from "jsdom";
import DOMPurify, { WindowLike } from "dompurify";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { Marked } from "marked";
import { ILogger } from "../common/logger.types.js";
import { CalendarEventData, DateTimeRange, MailFolderData, MailMessageData } from "./graph-service.types.js";

const CALENDAR_EVENT_PROPS = [
  "id",
  "createdDateTime",
  "type",
  "subject",
  "start",
  "end",
  "body",
  "organizer",
  "categories",
  "iCalUId",
  "hasAttachments",
  "showAs",
  "isOnlineMeeting",
  "isOrganizer",
  "attendees",
  "onlineMeeting",
];

const MAIL_FOLDER_PROPS = ["id", "displayName", "wellKnownName"];

const MAIL_MESSAGE_PROPS = [
  "id",
  "receivedDateTime",
  "createdDateTime",
  "sentDateTime",
  "subject",
  "importance",
  "sender",
  "from",
  "toRecipients",
  "replyTo",
  "parentFolderId",
  "isRead",
  "isDraft",
  "categories",
  "flag",
];

const MAIL_PREVIEW_MESSAGE_PROPS = MAIL_MESSAGE_PROPS.concat(["bodyPreview"]);
const MAIL_BODY_MESSAGE_PROPS = MAIL_MESSAGE_PROPS.concat(["body"]);

const DEFAULT_MAIL_FOLDERS_LIMIT = 100;

const DELETED_FOLDER_NAME = "deleteditems";
const JUNK_FOLDER_NAME = "junkemail";

const FILE_ATTACHMENT_ODATA_TYPE = "#microsoft.graph.fileAttachment";
// Graph sendMail caps the whole request near 4 MB. Base64 inflates by ~4/3, and the JSON envelope (body HTML, recipients,
// metadata) adds further overhead — so cap raw inline bytes at 2 MB to leave headroom. Anything larger falls back to the
// draft + upload-session path.
const MAX_INLINE_PER_FILE_BYTES = 2 * 1024 * 1024;
const MAX_INLINE_TOTAL_BYTES = 2 * 1024 * 1024;
// Per-file ceiling enforced by Graph upload sessions.
const MAX_ATTACHMENT_BYTES = 150 * 1024 * 1024;
const UPLOAD_CHUNK_SIZE = 4 * 1024 * 1024;

const MIME_BY_EXT: Record<string, string> = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".txt": "text/plain",
  ".csv": "text/csv",
  ".json": "application/json",
  ".xml": "application/xml",
  ".html": "text/html",
  ".htm": "text/html",
  ".md": "text/markdown",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".zip": "application/zip",
  ".gz": "application/gzip",
  ".tar": "application/x-tar",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".wav": "audio/wav",
};

interface LoadedAttachment {
  name: string;
  contentType: string;
  size: number;
  data: Buffer;
}

export class GraphService {
  private graphClient: Client;
  private domPurify: typeof DOMPurify;
  private nhm = new NodeHtmlMarkdown();
  private marked = new Marked({ gfm: true });
  private mailFolders: MailFolderData[];
  private filterFolderIds: string[] | undefined;

  constructor(private readonly logger: ILogger, private readonly tokenCredential: TokenCredential, private readonly scopes: string[]) {
    const authProvider = new TokenCredentialAuthenticationProvider(tokenCredential, {
      scopes,
    });
    this.graphClient = Client.initWithMiddleware({
      authProvider,
      defaultVersion: "beta",
      fetchOptions: { headers: { "User-Agent": "simply-outlook-mcp" } },
    });

    const window = new JSDOM("").window as unknown as WindowLike;
    this.domPurify = DOMPurify(window);
    this.mailFolders = [];
  }

  public async isAuthenticated(): Promise<boolean> {
    const token = await this.tokenCredential.getToken(this.scopes);
    return !!token;
  }

  public async getCalendars(): Promise<Calendar[]> {
    const collection: PageCollection = await this.graphClient
      .api("/me/calendars")
      .select(["id", "name", "owner", "canEdit", "canShare", "canViewPrivateItems"])
      .get();
    
    if (!collection.value) {
      throw new Error("Failed to get calendars.");
    }

    return collection.value;
  }

  public async getCalendarEvents(startDateTimeRange?: DateTimeRange, limit: number = 10, skip?: number): Promise<CalendarEventData[]> {
    const { startDateTime, endDateTime } = startDateTimeRange || {};
    
    // Get all calendars (including shared ones)
    const calendars = await this.getCalendars();
    
    // Fetch events from all calendars in parallel
    const eventPromises = calendars.map(async (calendar) => {
      try {
        const filters: string[] = [];
        let apiPath: string;
        
        if (startDateTime && endDateTime) {
          // Use calendarView for date range queries
          apiPath = `/me/calendars/${calendar.id}/calendarView?startDateTime=${startDateTime}&endDateTime=${endDateTime}`;
        } else {
          if (startDateTime) {
            filters.push(`start/dateTime ge '${startDateTime}'`);
          }
          if (endDateTime) {
            filters.push(`start/dateTime lt '${endDateTime}'`);
          }
          // Use events endpoint for filtered queries
          apiPath = `/me/calendars/${calendar.id}/events`;
        }

        const filterStr = filters.join(" and ");
        const query = this.graphClient
          .api(apiPath)
          .select(CALENDAR_EVENT_PROPS);
        
        // For calendarView, we can't use top/skip, so we'll fetch all and filter later
        if (!(startDateTime && endDateTime)) {
          query.top(1000); // Fetch a large number to get all events, we'll limit later
          filterStr && query.filter(filterStr);
        }

        const collection: PageCollection = await query.get();
        
        if (!collection.value) {
          return [];
        }

        return collection.value
          .filter((event) => this.isCalendarEventData(event))
          .map((event) => {
            if (event.body && event.body.content && event.body.contentType === "html") {
              event.body = {
                contentType: event.body.contentType,
                content: this.parseHtmlToMarkdown(event.body.content),
              };
            }
            return event;
          });
      } catch (error) {
        // Log error but continue with other calendars
        this.logger.warning(`Failed to get events from calendar ${calendar.name || calendar.id}: ${(error as Error).message}`);
        return [];
      }
    });

    // Wait for all calendar queries to complete
    const allEventsArrays = await Promise.all(eventPromises);
    
    // Flatten and combine all events
    const allEvents = allEventsArrays.flat();
    
    // Sort events by start date/time
    allEvents.sort((a, b) => {
      const aStart = a.start?.dateTime ? new Date(a.start.dateTime).getTime() : 0;
      const bStart = b.start?.dateTime ? new Date(b.start.dateTime).getTime() : 0;
      return aStart - bStart;
    });

    // Apply skip and limit
    const skipped = skip || 0;
    const limited = allEvents.slice(skipped, skipped + limit);
    
    return limited;
  }

  public async createCalendarEvent(
    subject: string,
    content: string,
    utcStartDate: string,
    utcEndDate: string,
    userEmails?: string[],
    location?: string,
    isMeeting?: boolean,
    categories?: string[],
    recurrence?: {
      pattern: {
        type: "daily" | "weekly" | "absoluteMonthly" | "relativeMonthly" | "absoluteYearly" | "relativeYearly";
        interval: number;
        daysOfWeek?: ("sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday")[];
      };
      range: {
        type: "endDate" | "noEnd" | "numbered";
        endDate?: string;
        numberOfOccurrences?: number;
      };
    },
    calendarId?: string
  ): Promise<CalendarEventData> {
    const attendees = userEmails ? userEmails.map((email) => ({ emailAddress: { address: email }, type: "required" })) : undefined;
    
    interface RecurrencePattern {
      type: string;
      interval: number;
      daysOfWeek?: string[];
    }

    interface RecurrenceRange {
      type: string;
      startDate: string;
      endDate?: string;
      numberOfOccurrences?: number;
    }

    interface EventRequest {
      subject: string;
      body: {
        contentType: string;
        content: string;
      };
      location?: { displayName: string } | null;
      isOnlineMeeting: boolean;
      start: {
        dateTime: string;
        timeZone: string;
      };
      end: {
        dateTime: string;
        timeZone: string;
      };
      attendees?: Array<{ emailAddress: { address: string }; type: string }>;
      categories?: string[];
      recurrence?: {
        pattern: RecurrencePattern;
        range: RecurrenceRange;
      };
    }

    const eventRequest: EventRequest = {
      subject,
      body: {
        contentType: "html",
        content: this.parseMarkdownToHtml(content),
      },
      location: location ? { displayName: location } : undefined,
      isOnlineMeeting: !!isMeeting,
      start: {
        dateTime: utcStartDate,
        timeZone: "UTC",
      },
      end: {
        dateTime: utcEndDate,
        timeZone: "UTC",
      },
      attendees,
      categories: categories || undefined,
    };

    // Add recurrence if provided
    if (recurrence) {
      const recurrencePattern: RecurrencePattern = {
        type: recurrence.pattern.type,
        interval: recurrence.pattern.interval,
      };

      if (recurrence.pattern.daysOfWeek && recurrence.pattern.daysOfWeek.length > 0) {
        recurrencePattern.daysOfWeek = recurrence.pattern.daysOfWeek;
      }

      // Extract date part from start date for recurrence range startDate
      const startDateOnly = new Date(utcStartDate).toISOString().split('T')[0];
      
      const recurrenceRange: RecurrenceRange = {
        type: recurrence.range.type,
        startDate: startDateOnly,
      };

      if (recurrence.range.type === "endDate" && recurrence.range.endDate) {
        recurrenceRange.endDate = recurrence.range.endDate;
      } else if (recurrence.range.type === "numbered" && recurrence.range.numberOfOccurrences) {
        recurrenceRange.numberOfOccurrences = recurrence.range.numberOfOccurrences;
      }

      eventRequest.recurrence = {
        pattern: recurrencePattern,
        range: recurrenceRange,
      };
    }

    // Use specific calendar endpoint if calendarId is provided, otherwise use default calendar
    const apiPath = calendarId ? `/me/calendars/${calendarId}/events` : `/me/events`;
    const event: Event = await this.graphClient.api(apiPath).post(eventRequest);
    if (!this.isCalendarEventData(event)) {
      throw new Error("Create event failed.");
    }

    if (event.body && event.body.content && event.body.contentType === "html") {
      event.body = {
        contentType: event.body.contentType,
        content: this.parseHtmlToMarkdown(event.body.content),
      };
    }

    return event;
  }

  public async updateCalendarEvent(
    id: string,
    content?: string,
    subject?: string,
    utcStartDate?: string,
    utcEndDate?: string,
    location?: string,
    categories?: string[]
  ): Promise<CalendarEventData> {
    if (
      content === undefined &&
      subject === undefined &&
      utcStartDate === undefined &&
      utcEndDate === undefined &&
      location === undefined &&
      categories === undefined
    ) {
      throw new Error("At least one property must be provided to update the calendar event.");
    }

    const updateRequest: Partial<Event> = {};

    if (subject !== undefined) {
      updateRequest.subject = subject;
    }

    if (content !== undefined) {
      updateRequest.body = {
        contentType: "html",
        content: this.parseMarkdownToHtml(content),
      };
    }

    if (utcStartDate !== undefined) {
      updateRequest.start = {
        dateTime: utcStartDate,
        timeZone: "UTC",
      };
    }

    if (utcEndDate !== undefined) {
      updateRequest.end = {
        dateTime: utcEndDate,
        timeZone: "UTC",
      };
    }

    if (location !== undefined) {
      updateRequest.location = location ? { displayName: location } : null;
    }

    if (categories !== undefined) {
      updateRequest.categories = categories;
    }

    const event: Event = await this.graphClient.api(`/me/events/${id}`).patch(updateRequest);
    if (!this.isCalendarEventData(event)) {
      throw new Error("Update event failed.");
    }

    if (event.body && event.body.content && event.body.contentType === "html") {
      event.body = {
        contentType: event.body.contentType,
        content: this.parseHtmlToMarkdown(event.body.content),
      };
    }

    return event;
  }

  public async deleteCalendarEvent(id: string): Promise<void> {
    await this.graphClient.api(`/me/events/${id}`).delete();
  }

  public async listOutlookCategories(): Promise<OutlookCategory[]> {
    const collection: PageCollection = await this.graphClient.api("/me/outlook/masterCategories").get();

    if (!collection.value) {
      throw new Error("Failed to get Outlook categories.");
    }

    return collection.value;
  }

  public async createOutlookCategory(displayName: string, color?: string): Promise<OutlookCategory> {
    const categoryRequest = {
      displayName,
      color: color || "none",
    };

    const category: OutlookCategory = await this.graphClient.api("/me/outlook/masterCategories").post(categoryRequest);

    return category;
  }

  public async deleteOutlookCategory(id: string): Promise<void> {
    await this.graphClient.api(`/me/outlook/masterCategories/${id}`).delete();
  }

  public async assignCategoriesToMessage(messageId: string, categories: string[]): Promise<void> {
    await this.graphClient.api(`/me/messages/${messageId}`).patch({
      categories,
    });
  }

  public async flagOutlookMessage(messageId: string, flagStatus: string, startDate?: string, dueDate?: string): Promise<void> {
    interface FlagData {
      flagStatus: string;
      startDateTime?: {
        dateTime: string;
        timeZone: string;
      };
      dueDateTime?: {
        dateTime: string;
        timeZone: string;
      };
    }

    const flagData: FlagData = {
      flagStatus: flagStatus,
    };

    if (flagStatus === "flagged") {
      if (startDate) {
        flagData.startDateTime = {
          dateTime: startDate,
          timeZone: "UTC",
        };
      }
      if (dueDate) {
        flagData.dueDateTime = {
          dateTime: dueDate,
          timeZone: "UTC",
        };
      }
    }

    await this.graphClient.api(`/me/messages/${messageId}`).patch({
      flag: flagData,
    });
  }

  public async getOutlookMessages(
    receivedDateTimeRange?: DateTimeRange,
    searchQuery?: string,
    limit: number = 10,
    skip?: number
  ): Promise<MailMessageData[]> {
    const filters: string[] = [];
    const { startDateTime, endDateTime } = receivedDateTimeRange || {};
    if (startDateTime) {
      filters.push(`receivedDateTime ge ${startDateTime}`);
    }

    if (endDateTime) {
      filters.push(`receivedDateTime lt ${endDateTime}`);
    }

    const filterFolders = await this.getFilterFolderIds();
    const folderIdSet = new Set<string>(filterFolders ? filterFolders : []);
    folderIdSet.forEach((folderId) => {
      filters.push(`parentFolderId ne '${folderId}'`);
    });

    const filterStr = filters.join(" and ");
    let query = this.graphClient.api("/me/messages").select(MAIL_PREVIEW_MESSAGE_PROPS).top(limit);
    // Graph search endpoint does not support MSA so use $search with limited functionalities
    const encodedQuery = searchQuery && encodeURIComponent(searchQuery);
    query = encodedQuery
      ? query.search(`"subject:${encodedQuery} OR body:${encodedQuery} OR from:${encodedQuery}"`)
      : query
          .filter(filterStr)
          .skip(skip || 0)
          .orderby("receivedDateTime desc");

    const collection: PageCollection = await query.get();
    if (!collection.value) {
      throw new Error("Failed to get messages.");
    }

    const messages = collection.value
      .filter((message) => this.isMailMessageData(message))
      .filter((message) => {
        if (searchQuery) {
          if (message.parentFolderId && folderIdSet.has(message.parentFolderId)) {
            return false;
          }

          if (startDateTime || endDateTime) {
            const receivedDate = new Date(message.receivedDateTime!);

            if (startDateTime && receivedDate < new Date(startDateTime)) {
              return false;
            }

            if (endDateTime && receivedDate >= new Date(endDateTime)) {
              return false;
            }
          }
        }
        return true;
      })
      .map((message) => {
        if (message.body && message.body.content && message.body.contentType === "html") {
          message.body = {
            contentType: message.body.contentType,
            content: this.parseHtmlToMarkdown(message.body.content),
          };
        }
        return message;
      });

    return messages;
  }

  public async getOutlookMessageById(id: string): Promise<MailMessageData> {
    const mailData = await this.graphClient.api(`/me/messages/${id}`).select(MAIL_BODY_MESSAGE_PROPS).get();
    if (!this.isMailMessageData(mailData)) {
      throw new Error("Get Outlook message failed.");
    }

    if (mailData.body && mailData.body.content && mailData.body.contentType === "html") {
      mailData.body = {
        contentType: mailData.body.contentType,
        content: this.parseHtmlToMarkdown(mailData.body.content),
      };
    }

    return mailData;
  }

  public async sendOutlookMessage(
    subject: string,
    content: string,
    recipientEmails: string[],
    attachmentPaths?: string[]
  ): Promise<void> {
    const toRecipients = recipientEmails.map((email) => ({ emailAddress: { address: email } }));
    const body = {
      contentType: "html" as const,
      content: this.parseMarkdownToHtml(content),
    };

    const attachments = attachmentPaths?.length ? await this.loadAttachmentsFromPaths(attachmentPaths) : [];

    if (attachments.length === 0) {
      const msgRequest: Message = { subject, body, toRecipients };
      await this.graphClient.api("/me/sendMail").post({ message: msgRequest });
      return;
    }

    if (this.canInlineAttachments(attachments)) {
      const msgRequest: Message = {
        subject,
        body,
        toRecipients,
        attachments: this.toInlineAttachments(attachments),
      };
      await this.graphClient.api("/me/sendMail").post({ message: msgRequest });
      return;
    }

    const draft: Message = await this.graphClient.api("/me/messages").post({
      subject,
      body,
      toRecipients,
    });
    if (!draft.id) {
      throw new Error("Failed to create draft message for attachments.");
    }

    await this.uploadAttachmentsAndSendDraft(draft.id, attachments);
  }

  public async replyOutlookMessage(replyMessageId: string, content: string, attachmentPaths?: string[]): Promise<void> {
    const originalMessage = await this.getOutlookMessageById(replyMessageId);

    const originalSender = originalMessage.from?.emailAddress?.name || originalMessage.from?.emailAddress?.address || "Unknown Sender";
    const originalDate = originalMessage.sentDateTime || originalMessage.receivedDateTime;
    const originalSubject = originalMessage.subject || "(No Subject)";
    const originalContent = originalMessage.body?.content || "";

    const replyContent = `${content}\n\n\n\n---\n\n**From:** ${originalSender}  \n**Date:** ${
      originalDate ? new Date(originalDate).toLocaleString() : "Unknown"
    }  \n**Subject:** ${originalSubject}  \n\n\n${originalContent}`;

    const body = {
      contentType: "html" as const,
      content: this.parseMarkdownToHtml(replyContent),
    };

    const attachments = attachmentPaths?.length ? await this.loadAttachmentsFromPaths(attachmentPaths) : [];

    if (attachments.length === 0) {
      const msgRequest: Message = { body };
      await this.graphClient.api(`/me/messages/${replyMessageId}/reply`).post({ message: msgRequest });
      return;
    }

    if (this.canInlineAttachments(attachments)) {
      const msgRequest: Message = {
        body,
        attachments: this.toInlineAttachments(attachments),
      };
      await this.graphClient.api(`/me/messages/${replyMessageId}/reply`).post({ message: msgRequest });
      return;
    }

    const draft: Message = await this.graphClient.api(`/me/messages/${replyMessageId}/createReply`).post({});
    if (!draft.id) {
      throw new Error("Failed to create reply draft for attachments.");
    }

    // createReply seeds the draft with an auto-generated quoted body; our replyContent already includes the quote,
    // so overwrite the body before uploading attachments and sending.
    await this.graphClient.api(`/me/messages/${draft.id}`).patch({ body });
    await this.uploadAttachmentsAndSendDraft(draft.id, attachments);
  }

  private async uploadAttachmentsAndSendDraft(draftId: string, attachments: LoadedAttachment[]): Promise<void> {
    try {
      for (const att of attachments) {
        await this.attachToDraft(draftId, att);
      }
      await this.graphClient.api(`/me/messages/${draftId}/send`).post({});
    } catch (error) {
      try {
        await this.graphClient.api(`/me/messages/${draftId}`).delete();
      } catch (cleanupError) {
        this.logger.warning(`Failed to delete draft ${draftId} after attachment error: ${(cleanupError as Error).message}`);
      }
      throw error;
    }
  }

  private async loadAttachmentsFromPaths(paths: string[]): Promise<LoadedAttachment[]> {
    const loaded: LoadedAttachment[] = [];
    for (const p of paths) {
      const abs = this.resolveAttachmentPath(p);
      let stat;
      try {
        stat = await fs.stat(abs);
      } catch (error) {
        throw new Error(`Cannot read attachment '${p}': ${(error as Error).message}`);
      }
      if (!stat.isFile()) {
        throw new Error(`Attachment '${p}' is not a file.`);
      }
      if (stat.size === 0) {
        throw new Error(`Attachment '${p}' is empty.`);
      }
      if (stat.size > MAX_ATTACHMENT_BYTES) {
        throw new Error(`Attachment '${p}' (${stat.size} bytes) exceeds the ${MAX_ATTACHMENT_BYTES}-byte limit.`);
      }
      const data = await fs.readFile(abs);
      const name = path.basename(abs);
      loaded.push({
        name,
        contentType: this.mimeForFileName(name),
        size: stat.size,
        data,
      });
    }
    return loaded;
  }

  private resolveAttachmentPath(p: string): string {
    if (p === "~") {
      return os.homedir();
    }
    if (p.startsWith("~/")) {
      return path.join(os.homedir(), p.slice(2));
    }
    if (!path.isAbsolute(p)) {
      // Relative paths would resolve against the MCP server's cwd, which is unpredictable for the caller. Fail loudly.
      throw new Error(`Attachment path '${p}' must be absolute (or start with '~/'). Pass a full path like '/Users/you/file.pdf'.`);
    }
    return p;
  }

  private mimeForFileName(name: string): string {
    const ext = path.extname(name).toLowerCase();
    return MIME_BY_EXT[ext] || "application/octet-stream";
  }

  private canInlineAttachments(attachments: LoadedAttachment[]): boolean {
    if (attachments.some((a) => a.size > MAX_INLINE_PER_FILE_BYTES)) {
      return false;
    }
    const total = attachments.reduce((sum, a) => sum + a.size, 0);
    return total <= MAX_INLINE_TOTAL_BYTES;
  }

  private buildFileAttachment(att: LoadedAttachment): FileAttachment {
    return {
      "@odata.type": FILE_ATTACHMENT_ODATA_TYPE,
      name: att.name,
      contentType: att.contentType,
      contentBytes: att.data.toString("base64"),
    } as FileAttachment;
  }

  private toInlineAttachments(attachments: LoadedAttachment[]): FileAttachment[] {
    return attachments.map((a) => this.buildFileAttachment(a));
  }

  private async attachToDraft(messageId: string, att: LoadedAttachment): Promise<void> {
    if (att.size <= MAX_INLINE_PER_FILE_BYTES) {
      await this.graphClient.api(`/me/messages/${messageId}/attachments`).post(this.buildFileAttachment(att));
      return;
    }

    const session: { uploadUrl?: string } = await this.graphClient
      .api(`/me/messages/${messageId}/attachments/createUploadSession`)
      .post({
        AttachmentItem: {
          attachmentType: "file",
          name: att.name,
          size: att.size,
          contentType: att.contentType,
        },
      });

    if (!session?.uploadUrl) {
      throw new Error(`Failed to create upload session for attachment '${att.name}'.`);
    }

    for (let offset = 0; offset < att.size; offset += UPLOAD_CHUNK_SIZE) {
      const end = Math.min(offset + UPLOAD_CHUNK_SIZE, att.size) - 1;
      const chunk = att.data.subarray(offset, end + 1);
      // Node fetch accepts Buffer at runtime, but DOM's BodyInit type excludes Uint8Array<ArrayBufferLike>. Cast through unknown.
      const response = await fetch(session.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Length": String(chunk.byteLength),
          "Content-Range": `bytes ${offset}-${end}/${att.size}`,
        },
        body: chunk as unknown as BodyInit,
      });
      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(`Upload chunk failed for '${att.name}' (status ${response.status}): ${detail}`);
      }
    }
  }

  public async moveOutlookMessage(messageId: string, destinationFolderId: string): Promise<void> {
    // Move the message to the specified folder
    await this.graphClient.api(`/me/messages/${messageId}/move`).post({
      destinationId: destinationFolderId,
    });
  }

  public async listMailFolders(limit?: number): Promise<MailFolderData[]> {
    return this.getMailFolders(limit);
  }

  private async getMailFolders(limit?: number): Promise<MailFolderData[]> {
    const collection: PageCollection = await this.graphClient
      .api("/me/mailFolders")
      .select(MAIL_FOLDER_PROPS)
      .top(limit || DEFAULT_MAIL_FOLDERS_LIMIT)
      .get();
    if (!collection.value) {
      throw new Error("Failed to get mail folders.");
    }

    return collection.value.filter((value) => this.isMailFolderData(value));
  }

  private async getFilterFolderIds(): Promise<string[] | undefined> {
    if (this.filterFolderIds) {
      return this.filterFolderIds;
    }

    try {
      this.mailFolders = await this.getMailFolders(DEFAULT_MAIL_FOLDERS_LIMIT);
    } catch (error) {
      this.logger.error(`Failed to get mail folders: ${(error as Error).message}`);
      return undefined;
    }

    this.filterFolderIds = this.mailFolders
      .filter((folder) => folder.wellKnownName === DELETED_FOLDER_NAME || folder.wellKnownName === JUNK_FOLDER_NAME)
      .map((folder) => folder.id);

    return this.filterFolderIds;
  }

  private parseHtmlToMarkdown(htmlText: string): string {
    return this.nhm.translate(htmlText);
  }

  private parseMarkdownToHtml(markdownText: string): string {
    const html = this.marked.parse(markdownText, { async: false });
    return this.domPurify.sanitize(html);
  }

  private isCalendarEventData(event: Event): event is CalendarEventData {
    return !!event && !!event.id && !!event.type && !!event.start;
  }

  private isMailMessageData(message: Message): message is MailMessageData {
    return !!message && !!message.id && !!message.receivedDateTime;
  }

  private isMailFolderData(data: unknown): data is MailFolderData {
    const mailFolder = data as MailFolderData;
    return !!mailFolder && !!mailFolder.id && !!mailFolder.displayName;
  }
}
