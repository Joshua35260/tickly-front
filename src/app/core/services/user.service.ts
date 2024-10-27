import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
 // Assurez-vous d'importer le modèle User
import { environment } from '../../../environments/environment';
import { User } from '../models/user.class';
import { PaginatedData } from '../models/paginated-data.class';
import { AbstractCrudService } from './abstract-crud.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends AbstractCrudService<User> {

  constructor() {
    super(`${environment.apiUrl}/user`);
  }

}
