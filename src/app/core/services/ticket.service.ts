import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
 // Assurez-vous d'importer le modèle Ticket
import { environment } from '../../../environments/environment';
import { PaginatedData } from '../models/paginated-data.class';
import { Ticket } from '../models/ticket.class';
import { AbstractCrudService } from './abstract-crud.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService extends AbstractCrudService<Ticket> {
  constructor() {
    super(`${environment.apiUrl}/ticket`);
  }

  getAutocompleteTicketByName(name: string): Observable<PaginatedData<Ticket>> {
    return this.http.get<PaginatedData<Ticket>>(`${environment.apiUrl}/ticket`, {
      params: {
        'name': name,
      },
    }).pipe(
      catchError((error) => {
        console.error('Error fetching tickets', error);
        return throwError(() => new Error('Error fetching tickets'));
      })
    );
  }
  assignUserToTicket(ticketId: number, userId: number): Observable<Ticket> {
    return this.http.post<Ticket>(`${environment.apiUrl}/ticket/${ticketId}/assign-user`, { userId }).pipe(
      tap((ticket) => {
        this.entityChanged.next();
      }),
      catchError((error) => {
        console.error('Error assigning user to ticket', error);
        return throwError(() => new Error('Error assigning user to ticket'));
      })
    );
  }
  

  removeUserFromTicket(ticketId: number, userId: number): Observable<Ticket> {
    return this.http.post<Ticket>(`${environment.apiUrl}/ticket/${ticketId}/remove-user`, { userId }).pipe(
      tap((ticket) => {
        this.entityChanged.next();
      }),
      catchError((error) => {
        console.error('Error removing user from ticket', error);
        return throwError(() => new Error('Error removing user from ticket'));
      })
    );
  }
}
