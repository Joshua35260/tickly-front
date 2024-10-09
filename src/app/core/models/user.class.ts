import { Address } from "./address.class";
import { Email } from "./email.class";
import { Phone } from "./phone.class";
import { Role } from "./role.class";

export class User {
  id?: number;
  login: string;
  password: string;
  firstname: string;
  lastname: string;
  roles: Role[];
  emails: Email[];
  phones: Phone[];
  
  address: Address;
  avatarUrl?: string;
  archive?: boolean;

  get fullName(): string {
    return `${this.firstname} ${this.lastname}`;
  }
}