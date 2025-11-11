/**
 * Notification model interfaces for Teamwork API
 */

export interface NotificationPerson {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export interface NotificationProject {
  id: number;
  name: string;
}

export interface NotificationResource {
  id: number;
  type: string;
  name?: string;
}

export interface Notification {
  id: number;
  resourceId: number;
  resourceType: string;
  actionType: string;
  createdAt: string;
  readAt?: string;
  dismissedAt?: string;
  actioner?: NotificationPerson;
  project?: NotificationProject;
  resource?: NotificationResource;
  text?: string;
  title?: string;
  url?: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  meta?: {
    page?: {
      pageOffset?: number;
      pageSize?: number;
      count?: number;
    };
  };
}

export interface UnreadCountResponse {
  unreadCount: number;
}


