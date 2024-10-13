import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
 // Assurez-vous d'importer le modèle Structure
import { environment } from '../../../environments/environment';
import { PaginatedData } from '../models/paginated-data.class';
import { Structure } from '../models/structure.class';

@Injectable({
  providedIn: 'root'
})
export class StructureService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  addStructure(structure: Structure): Observable<Structure> {
    return this.http.post<Structure>(`${this.apiUrl}/structure`, structure);
  }

  getAllStructures(): Observable<Structure[]> {
    return this.http.get<Structure[]>(`${this.apiUrl}/structure`).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des structures', error);
        return throwError(() => new Error('Erreur lors de la récupération des structures'));
      })
    );
  }
 
  getPaginatedStructures(page: number = 1, pagesize: number = 20): Observable<PaginatedData<Structure>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pagesize.toString());

    return this.http.get<PaginatedData<Structure>>(`${this.apiUrl}/structure`, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching paginated structures', error);
        return throwError(() => new Error('Error fetching paginated structures'));
      })
    );
  }
  
  getStructure(structureId: number): Observable<Structure> {
    return this.http.get<Structure>(`${this.apiUrl}/structure/${structureId}`).pipe(
      catchError((error) => {
        console.error('Error fetching structure', error);
        return throwError(() => new Error('Error fetching structure'));
      })
    );
  }

  updateStructure(structure: Partial<Structure>): Observable<Structure> {
    return this.http.patch<Structure>(`${this.apiUrl}/structure/${structure.id}`, structure).pipe(
      catchError((error) => {
        console.error('Error updating structure', error);
        return throwError(() => new Error('Error updating structure'));
      })
    );
  }
  
  deleteStructure(structureId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/structure/${structureId}`).pipe(
      catchError((error) => {
        console.error('Error deleting structure', error);
        return throwError(() => new Error('Error deleting structure'));
      })
    );
  }

  getAutocompleteStructureByName(name: string): Observable<PaginatedData<Structure>> {
    return this.http.get<PaginatedData<Structure>>(`${environment.apiUrl}/structure`, {
      params: {
        'name': name,
      },
    }).pipe(
      catchError((error) => {
        console.error('Error fetching structures', error);
        return throwError(() => new Error('Error fetching structures'));
      })
    );
  }
  
  

}
