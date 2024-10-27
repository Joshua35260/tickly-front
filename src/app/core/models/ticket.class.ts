import { Category } from './category.class';
import { Priority } from './priority.class';
import { Status } from './status.class';
import { Structure } from './structure.class';
import { User } from './user.class';

export class Ticket {
  id?: number;

  author: User;

  description: string;

  createdAt: Date;

  updatedAt: Date;

  archivedAt: Date;

  status: Status;

  priority: Priority;

  category: Category[];

  archive?: boolean;
}
