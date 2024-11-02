import { Injectable } from '@angular/core';
// Assurez-vous d'importer le modèle User
import { environment } from '../../../environments/environment';
import { User } from '../models/user.class';
import { AbstractCrudService } from './abstract-crud.service';
import { Observable, catchError, throwError } from 'rxjs';
import { PaginatedData } from '../models/paginated-data.class';

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

  addStructureToUser(structureId: number, userId: number): Observable<User> {
    return this.http.post<any>(
      `${environment.apiUrl}/user/${structureId}/users/${userId}`,
      {
        structureId: structureId,
        userId: userId,
      }
    );
  }

  deleteStructureFromUser(
    userId: number,
    structureId: number
  ): Observable<User> {
    return this.http.delete<any>(
      `${environment.apiUrl}/user/${userId}/structures/${structureId}`
    );
  }
}
