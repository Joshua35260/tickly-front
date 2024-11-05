import { Address } from './address.class';
import { User } from "./user.class";

export class Structure {
  id?: number;
  name: string;
  type?: string;
  service?: string;
  email: string;
  phone: string;
  users?: User[];
  address: Address;
  archivedAt?: Date;
  avatarId?: number;
  avatarUrl?: string;
}