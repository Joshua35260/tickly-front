import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
 // Assurez-vous d'importer le modèle User
import { environment } from '../../../environments/environment';
import { User } from '../models/user.class';
import { PaginatedData } from '../models/paginated-data.class';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/user`, user);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/user`).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
        return throwError(() => new Error('Erreur lors de la récupération des utilisateurs'));
      })
    );
  }
 
  getPaginatedUsers(page: number = 1, pagesize: number = 20): Observable<PaginatedData<User>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pagesize.toString());

    return this.http.get<PaginatedData<User>>(`${this.apiUrl}/user`, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching paginated users', error);
        return throwError(() => new Error('Error fetching paginated users'));
      })
    );
  }
  
  getUser(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/${userId}`).pipe(
      catchError((error) => {
        console.error('Error fetching user', error);
        return throwError(() => new Error('Error fetching user'));
      })
    );
  }

  updateUser(user: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/user/${user.id}`, user).pipe(
      catchError((error) => {
        console.error('Error updating user', error);
        return throwError(() => new Error('Error updating user'));
      })
    );
  }
  
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/user/${userId}`).pipe(
      catchError((error) => {
        console.error('Error deleting user', error);
        return throwError(() => new Error('Error deleting user'));
      })
    );
  }
}
