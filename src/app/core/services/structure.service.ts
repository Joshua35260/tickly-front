import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedData } from '../models/paginated-data.class';
import { Structure } from '../models/structure.class';
import { User } from '../models/user.class';
import { AbstractCrudService } from './abstract-crud.service';


@Injectable({
  providedIn: 'root'
})
export class StructureService extends AbstractCrudService<Structure> {


  constructor() {
    super(`${environment.apiUrl}/structure`);
  }

  getAutocompleteStructureByName(name: string): Observable<PaginatedData<Structure>> {
    return this.http.get<PaginatedData<Structure>>(`${environment.apiUrl}/structure`, {
      params: {
        'name': name,
        'pageSize': 1000,
      },
    })
  }

  
// add structure to user

addUserToStructure(userId: number, structureId: number,): Observable<User> {
  return this.http.post<any>(`${environment.apiUrl}/user/${userId}/structures/${structureId}`, {
    userId: userId,
    structureId: structureId,
  })
}

deleteUserFromStructure(userId: number, structureId: number): Observable<User> {
  return this.http.delete<any>(`${environment.apiUrl}/user/${userId}/structures/${structureId}`)
}
}
