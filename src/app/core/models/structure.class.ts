import { Address } from './address.class';
import { Email } from "./email.class";
import { Phone } from "./phone.class";
import { User } from "./user.class";

export class Structure {
  id?: number;
  name: string;
  type?: string;
  service?: string;
  emails: Email[];
  phones: Phone[];
  users?: User[];
  address: Address;
}