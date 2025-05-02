import { Status } from '../enums/enums';

export interface ShortenedURL {
  id: string;
  shortCode: string;
  originalUrl: string;
  createdAt: Date;
  visitCount: number;
  searchCount: number;
  status: Status;
}

export const UrlStore = new Map<string, ShortenedURL>();
