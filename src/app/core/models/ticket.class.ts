import { Structure } from './structure.class';
import { User } from './user.class';

export class Ticket {
  id?: number;

  title: string;

  authorId: number;
  author: User;

  description: string;

  createdAt: Date;

  updatedAt: Date;

  archivedAt?: Date | null;

  status: string;

  priority: string;

  category: string[];

  assignedUsers?: User[];

  structureId?: number;
  
  structure?: Structure;
}
