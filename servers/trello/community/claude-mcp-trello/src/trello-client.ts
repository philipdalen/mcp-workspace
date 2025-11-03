import axios, { AxiosInstance } from 'axios';
import {
  TrelloConfig,
  TrelloCard,
  TrelloList,
  TrelloAction,
  TrelloChecklist,
  TrelloCheckItem,
  TrelloMember,
} from './types.js';
import { createTrelloRateLimiters } from './rate-limiter.js';

export class TrelloClient {
  private axiosInstance: AxiosInstance;
  private rateLimiter;

  constructor(private config: TrelloConfig) {
    this.axiosInstance = axios.create({
      baseURL: 'https://api.trello.com/1',
      params: {
        key: config.apiKey,
        token: config.token,
      },
    });

    this.rateLimiter = createTrelloRateLimiters();

    // Add rate limiting interceptor
    this.axiosInstance.interceptors.request.use(async config => {
      await this.rateLimiter.waitForAvailable();
      return config;
    });
  }

  private async handleRequest<T>(request: () => Promise<T>): Promise<T> {
    try {
      return await request();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          // Rate limit exceeded, wait and retry
          await new Promise(resolve => setTimeout(resolve, 1000));
          return this.handleRequest(request);
        }
        throw new Error(`Trello API error: ${error.response?.data?.message ?? error.message}`);
      }
      throw error;
    }
  }

  async getCardsByList(listId: string): Promise<TrelloCard[]> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.get(`/lists/${listId}/cards`);
      return response.data;
    });
  }

  async getLists(): Promise<TrelloList[]> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.get(`/boards/${this.config.boardId}/lists`);
      return response.data;
    });
  }

  async getRecentActivity(limit: number = 10): Promise<TrelloAction[]> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.get(`/boards/${this.config.boardId}/actions`, {
        params: { limit },
      });
      return response.data;
    });
  }

  async addCard(params: {
    listId: string;
    name: string;
    description?: string;
    dueDate?: string;
    labels?: string[];
    members?: string[];
  }): Promise<TrelloCard> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.post('/cards', {
        idList: params.listId,
        name: params.name,
        desc: params.description,
        due: params.dueDate,
        idLabels: params.labels,
        idMembers: params.members,
      });
      return response.data;
    });
  }

  async updateCard(params: {
    cardId: string;
    name?: string;
    description?: string;
    dueDate?: string;
    labels?: string[];
    members?: string[];
  }): Promise<TrelloCard> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.put(`/cards/${params.cardId}`, {
        name: params.name,
        desc: params.description,
        due: params.dueDate,
        idLabels: params.labels,
        idMembers: params.members,
      });
      return response.data;
    });
  }

  async archiveCard(cardId: string): Promise<TrelloCard> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.put(`/cards/${cardId}`, {
        closed: true,
      });
      return response.data;
    });
  }

  async addList(name: string): Promise<TrelloList> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.post('/lists', {
        name,
        idBoard: this.config.boardId,
      });
      return response.data;
    });
  }

  async archiveList(listId: string): Promise<TrelloList> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.put(`/lists/${listId}/closed`, {
        value: true,
      });
      return response.data;
    });
  }

  async getMyCards(): Promise<TrelloCard[]> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.get('/members/me/cards');
      return response.data;
    });
  }

  async searchAllBoards(
    query: string,
    limit: number = 10
  ): Promise<{ cards: TrelloCard[]; boards: unknown[] }> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.get('/search', {
        params: {
          query,
          modelTypes: 'all',
          boards_limit: limit,
          cards_limit: limit,
          organization: true,
        },
      });
      return response.data;
    });
  }

  // Checklist operations
  async getChecklistsOnCard(cardId: string): Promise<TrelloChecklist[]> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.get(`/cards/${cardId}/checklists`);
      return response.data;
    });
  }

  async createChecklist(params: {
    cardId: string;
    name: string;
    pos?: number | string;
  }): Promise<TrelloChecklist> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.post(`/cards/${params.cardId}/checklists`, {
        name: params.name,
        pos: params.pos,
      });
      return response.data;
    });
  }

  async deleteChecklist(checklistId: string): Promise<void> {
    return this.handleRequest(async () => {
      await this.axiosInstance.delete(`/checklists/${checklistId}`);
    });
  }

  async updateChecklist(params: {
    checklistId: string;
    name?: string;
    pos?: number | string;
  }): Promise<TrelloChecklist> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.put(`/checklists/${params.checklistId}`, {
        name: params.name,
        pos: params.pos,
      });
      return response.data;
    });
  }

  // Checklist item operations
  async createCheckItem(params: {
    checklistId: string;
    name: string;
    pos?: number | string;
    checked?: boolean;
  }): Promise<TrelloCheckItem> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.post(
        `/checklists/${params.checklistId}/checkItems`,
        {
          name: params.name,
          pos: params.pos,
          checked: params.checked,
        }
      );
      return response.data;
    });
  }

  async updateCheckItem(params: {
    cardId: string;
    checkItemId: string;
    name?: string;
    state?: 'complete' | 'incomplete';
    pos?: number | string;
  }): Promise<TrelloCheckItem> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.put(
        `/cards/${params.cardId}/checkItem/${params.checkItemId}`,
        {
          name: params.name,
          state: params.state,
          pos: params.pos,
        }
      );
      return response.data;
    });
  }

  async deleteCheckItem(params: { checklistId: string; checkItemId: string }): Promise<void> {
    return this.handleRequest(async () => {
      await this.axiosInstance.delete(
        `/checklists/${params.checklistId}/checkItems/${params.checkItemId}`
      );
    });
  }

  // Member operations
  async addMemberToCard(cardId: string, memberId: string): Promise<TrelloCard> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.post(`/cards/${cardId}/idMembers`, {
        value: memberId,
      });
      return response.data;
    });
  }

  async removeMemberFromCard(cardId: string, memberId: string): Promise<void> {
    return this.handleRequest(async () => {
      await this.axiosInstance.delete(`/cards/${cardId}/idMembers/${memberId}`);
    });
  }

  async getBoardMembers(): Promise<TrelloMember[]> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.get(`/boards/${this.config.boardId}/members`);
      return response.data;
    });
  }

  async getCurrentUser(): Promise<TrelloMember> {
    return this.handleRequest(async () => {
      const response = await this.axiosInstance.get('/members/me');
      return response.data;
    });
  }
}
