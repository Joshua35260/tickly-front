import { RoleEnum } from "./enums/role.enum";
import { User } from "./user.class";

export class Role {
  role: RoleEnum;
  users?: User[];
}