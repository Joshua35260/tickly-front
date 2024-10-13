import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
 // Assurez-vous d'importer le modèle Ticket
import { environment } from '../../../environments/environment';
import { PaginatedData } from '../models/paginated-data.class';
import { Ticket } from '../models/ticket.class';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  addTicket(ticket: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.apiUrl}/ticket`, ticket);
  }

  getAllTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/ticket`).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des tickets', error);
        return throwError(() => new Error('Erreur lors de la récupération des tickets'));
      })
    );
  }

  getPaginatedTickets(page: number = 1, pagesize: number = 20): Observable<PaginatedData<Ticket>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pagesize.toString());

    return this.http.get<PaginatedData<Ticket>>(`${this.apiUrl}/ticket`, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching paginated tickets', error);
        return throwError(() => new Error('Error fetching paginated tickets'));
      })
    );
  }
  
  getTicket(ticketId: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/ticket/${ticketId}`).pipe(
      catchError((error) => {
        console.error('Error fetching ticket', error);
        return throwError(() => new Error('Error fetching ticket'));
      })
    );
  }

  updateTicket(ticket: Partial<Ticket>): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.apiUrl}/ticket/${ticket.id}`, ticket).pipe(
      catchError((error) => {
        console.error('Error updating ticket', error);
        return throwError(() => new Error('Error updating ticket'));
      })
    );
  }
  
  deleteTicket(ticketId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/ticket/${ticketId}`).pipe(
      catchError((error) => {
        console.error('Error deleting ticket', error);
        return throwError(() => new Error('Error deleting ticket'));
      })
    );
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
  
  

}
