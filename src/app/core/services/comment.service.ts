import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AbstractCrudService } from './abstract-crud.service';
import { Observable } from 'rxjs/internal/Observable';
import { Comment } from '@app/core/models/comment.class';

@Injectable({
  providedIn: 'root',
})
export class CommentService extends AbstractCrudService<Comment> {
  constructor() {
    super(`${environment.apiUrl}/comment`);
  }

  getByTicketId(ticketId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/ticket/${ticketId}`);
  }
  
}
