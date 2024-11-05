import { User } from './user.class';

export class Comment {
  id: number;

  content: string;

  createdAt: Date;

  readAt?: Date;

  ticketId: number;

  authorId: number;

  author: User;

  mediaId?: number;

  mediaUrl?: string;
}
