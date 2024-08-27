import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
 // Assurez-vous d'importer le modèle User
import { environment } from '../../../environments/environment';
import { User } from '../models/user.class';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/user`, user);
  }
}
