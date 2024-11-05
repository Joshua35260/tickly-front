import { Address } from "./address.class";
import { Role } from "./role.class";
import { Structure } from "./structure.class";

export class User {
  id?: number;
  login: string;
  password: string;
  firstname: string;
  lastname: string;
  roles: Role[];
  email: string;
  phone: string;
  address: Address;
  avatarId?: number;
  avatarUrl?: string;
  archivedAt?: Date;
  structures?: Structure[];

  get fullName(): string {
    return `${this.firstname} ${this.lastname}`;
  }

  constructor(data: Partial<User>) {
    Object.assign(this, data); // Assign properties from the provided data
  }
}