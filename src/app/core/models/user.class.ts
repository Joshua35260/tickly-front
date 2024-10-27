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
  avatarUrl?: string;
  archive?: boolean;
  structures?: Structure[];
  get fullName(): string {
    return `${this.firstname} ${this.lastname}`;
  }
}