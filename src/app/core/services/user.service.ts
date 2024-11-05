import { Injectable } from '@angular/core';
// Assurez-vous d'importer le modèle User
import { environment } from '../../../environments/environment';
import { User } from '../models/user.class';
import { AbstractCrudService } from './abstract-crud.service';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { PaginatedData } from '../models/paginated-data.class';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService extends AbstractCrudService<User> {
  constructor() {
    super(`${environment.apiUrl}/user`);
  }
  getAutocompleteUserByName(name: string): Observable<PaginatedData<User>> {
    return this.http.get<PaginatedData<User>>(`${environment.apiUrl}/user`, {
      params: {
        name: name,
        pageSize: 1000,
      },
    });
  }
  getPaginatedWithFilter(
    page: number = 1,
    pageSize: number = 20,
    filter: any = {}
  ): Observable<PaginatedData<User>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('search', filter.search || '')
      .set('sort', filter.sort || '')
      .set('hideArchive', filter.hideArchive ? 'true' : 'false');

    return this.http.get<PaginatedData<User>>(`${environment.apiUrl}/user`, {
      params,
    });
  }

  addStructureToUser(userId: number, structureId: number): Observable<User> {
    return this.http
      .post<any>(`${environment.apiUrl}/user/${userId}/structures/${structureId}`, {
        userId: userId,
        structureId: structureId,
      })
      .pipe(
        tap(() => {
          this.entityChanged.next();
        })
      );
  }

  deleteStructureFromUser(
    userId: number,
    structureId: number
  ): Observable<User> {
    return this.http
      .delete<any>(`${environment.apiUrl}/user/${userId}/structures/${structureId}`)
      .pipe(
        tap(() => {
          this.entityChanged.next();
        })
      );
  }
}
