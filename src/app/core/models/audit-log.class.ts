import { AuditLogValue } from "./audit-log-value.class";
import { LinkedTable } from "./enums/linked-table.enum";
import { User } from "./user.class";

export class AuditLog {
  id: number;
  userId: number;
  linkedId: number;
  linkedTable: LinkedTable
  action: string;
  modificationDate: Date;
  // Relations
  fields: AuditLogValue[]; 
  user: User;

}
