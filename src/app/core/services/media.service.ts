import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { AbstractCrudService } from './abstract-crud.service';

export interface Media {
  id: number;
  filename: string;
  mimetype: string;
  userId?: number;
  ticketId?: number;
  structureId?: number;
  commentId?: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class MediaService extends AbstractCrudService<Media>{
private readonly baseUrl = `${environment.apiUrl}/media`;
  constructor() {
    super(`${environment.apiUrl}/media`);
  }


  uploadSingleFile(file: File, dto: Partial<Media>): Observable<Media> {
    const formData: FormData = new FormData();

    // Ajoutez le fichier au FormData
    formData.append('file', file);

    // Vérifiez que userId est un nombre
    if (dto.userId !== undefined) {
      formData.append('userId', dto.userId.toString());
    } else if (dto.ticketId !== undefined) {
      formData.append('ticketId', dto.ticketId.toString());
    } else if (dto.structureId !== undefined) {
      formData.append('structureId', dto.structureId.toString());
    } else if (dto.commentId !== undefined) {
      formData.append('commentId', dto.commentId.toString());
    } else {
      console.error('Invalid dto:', dto);
    }
    return this.http.post<Media>(`${this.baseUrl}`, formData).pipe(
      tap(() => this.entityChanged.next())// Notify that the entity has changed
    );
  }


}
