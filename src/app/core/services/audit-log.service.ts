import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { catchError, Observable } from 'rxjs';
import { AuditLog } from '../models/audit-log.class';
import { AbstractCrudService } from './abstract-crud.service';

@Injectable({
  providedIn: 'root',
})
export class AuditLogService extends AbstractCrudService<AuditLog> {
  constructor() {
    super(`${environment.apiUrl}/audit-log`);
  }

  getAuditLogsByEntity(linkedTable: string, linkedId: number): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.apiUrl}/${linkedTable}/${linkedId}`);
  }
}
