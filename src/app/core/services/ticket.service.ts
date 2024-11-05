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
    })
  }

  getPaginatedWithFilter(
    page: number = 1,
    pageSize: number = 20,
    filter: any = {},
  ): Observable<PaginatedData<Ticket>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('search', filter.search || '')
      .set('sort', filter.sort || '')
      .set('hideArchive', filter.hideArchive ? 'true' : 'false');
  
    // Vérification et ajout des filtres s'ils existent
    if (filter.status && filter.status.length > 0) {
      filter.status.forEach(status => {
        params = params.append('status', status); // Ajout des statuts
      });
    }
  
    if (filter.priority && filter.priority.length > 0) {
      filter.priority.forEach(priority => {
        params = params.append('priority', priority); // Ajout des priorités
      });
    }
  
    if (filter.category && filter.category.length > 0) {
      filter.category.forEach(category => {
        params = params.append('category', category); // Ajout des catégories
      });
    }
  
    return this.http.get<PaginatedData<Ticket>>(`${environment.apiUrl}/ticket`, { params });
  }
  


  assignUserToTicket(ticketId: number, userId: number): Observable<Ticket> {
    return this.http.post<Ticket>(`${environment.apiUrl}/ticket/${ticketId}/assign-user`, { userId }).pipe(
      tap((ticket) => {
        this.entityChanged.next();
      }));
  }
  

  removeUserFromTicket(ticketId: number, userId: number): Observable<Ticket> {
    return this.http.post<Ticket>(`${environment.apiUrl}/ticket/${ticketId}/remove-user`, { userId }).pipe(
      tap((ticket) => {
        this.entityChanged.next();
      })
    );
  }
  
  getTicketByStructureId(structureId: number): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${environment.apiUrl}/ticket/structure/${structureId}`);
  }

  getTicketsOpen(): Observable<{ count: number; tickets: Ticket[] }> {
    return this.http.get<{ count: number; tickets: Ticket[] }>(`${environment.apiUrl}/ticket/open`);
  }

  getTicketByUserId(userId: number): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${environment.apiUrl}/ticket/user/${userId}`);
  }

  getTicketStats(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/ticket/stats`);
  }
}
