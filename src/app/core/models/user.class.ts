import { Address } from "./address.class";
import { Email } from "./email.class";
import { jobType } from "./enums/job-type.enum";
import { Phone } from "./phone.class";
import { Role } from "./role.class";
import { Structure } from "./structure.class";

export class User {
  id?: number;
  login: string;
  password: string;
  firstname: string;
  lastname: string;
  roles: Role[];
  emails: Email[];
  phones: Phone[];
  jobTypeId : jobType;
  address: Address;
  avatarUrl?: string;
  archive?: boolean;
  structures?: Structure[];
  get fullName(): string {
    return `${this.firstname} ${this.lastname}`;
  }
}