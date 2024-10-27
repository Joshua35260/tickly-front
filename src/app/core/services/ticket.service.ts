import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
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
  
}
