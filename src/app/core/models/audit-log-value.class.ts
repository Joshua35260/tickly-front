
export class AuditLogValue {
  id: number;
  auditLogId: number;
  field: string; 
  previousValue?: string | null; 
  newValue: string; 
}
