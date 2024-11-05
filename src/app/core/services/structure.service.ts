import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedData } from '../models/paginated-data.class';
import { Structure } from '../models/structure.class';
import { User } from '../models/user.class';
import { AbstractCrudService } from './abstract-crud.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StructureService extends AbstractCrudService<Structure> {
  constructor() {
    super(`${environment.apiUrl}/structure`);
  }

  getAutocompleteStructureByName(
    name: string
  ): Observable<PaginatedData<Structure>> {
    return this.http.get<PaginatedData<Structure>>(
      `${environment.apiUrl}/structure`,
      {
        params: {
          name: name,
          pageSize: 1000,
        },
      }
    );
  }

  getStructureByUser(id: number): Observable<Structure[]> {
    return this.http.get<Structure[]>(
      `${environment.apiUrl}/structure/user/${id}`
    );
  }

  getPaginatedWithFilter(
    page: number = 1,
    pageSize: number = 20,
    filter: any = {}
  ): Observable<PaginatedData<Structure>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('search', filter.search || '') // Ajout du paramètre de recherche
      .set('sort', filter.sort || '') // Ajout du paramètre de tri
      .set('hideArchive', filter.hideArchive ? 'true' : 'false');

    // Vérification et ajout des filtres s'ils existent

    return this.http.get<PaginatedData<Structure>>(
      `${environment.apiUrl}/structure`,
      { params }
    );
  }

  // add structure to user

  addUserToStructure(structureId: number, userId: number): Observable<User> {
    return this.http
      .post<any>(`${environment.apiUrl}/structure/${structureId}/users/${userId}`, {
        structureId: structureId,
        userId: userId,
      })
      .pipe(
        tap(() => {
          this.entityChanged.next();
        })
      );
  }

  deleteUserFromStructure(
    structureId: number,
    userId: number
  ): Observable<User> {
    return this.http
      .delete<any>(`${environment.apiUrl}/structure/${structureId}/users/${userId}`)
      .pipe(
        tap(() => {
          this.entityChanged.next();
        })
      );
  }
}
