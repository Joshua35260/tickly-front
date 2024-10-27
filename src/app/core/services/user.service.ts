import { Injectable } from '@angular/core';
 // Assurez-vous d'importer le modèle User
import { environment } from '../../../environments/environment';
import { User } from '../models/user.class';
import { AbstractCrudService } from './abstract-crud.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends AbstractCrudService<User> {

  constructor() {
    super(`${environment.apiUrl}/user`);
  }

}
