import { CommentService } from '../../../core/services/comment.service';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { WidgetComponent } from '../../common/widget/widget.component';
import { WidgetTitleComponent } from '../../common/widget-title/widget-title.component';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Comment } from '@app/core/models/comment.class';
import { distinctUntilChanged, startWith } from 'rxjs';
import { AuthService } from '@app/core/services/auth.service';
import { CommentCreateEditComponent } from '../comment-create-edit/comment-create-edit.component';
import { CommentRowComponent } from '../comment-row/comment-row.component';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    WidgetComponent,
    WidgetTitleComponent,
    CommentCreateEditComponent,
    CommentRowComponent,
  ],
})
export class CommentListComponent implements OnInit {
  ticketId = input.required<number>();
  ticketId$ = toObservable(this.ticketId);
  comments = signal<Comment[]>([]);
  userConnectedId = signal<number>(null);
  subFormOpened: boolean = false;
  selectedComment = signal<Comment>(null);

  commentsComputed = computed(() => 
    this.comments().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  );
  

  constructor(
    private destroyRef: DestroyRef,
    private commentService: CommentService,
    private authService: AuthService
  ) {
    this.commentService.entityChanged$ //reload items automatically on crud activity on this service
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {
      this.loadComments();
    });
  }

  ngOnInit() {
    this.ticketId$
      .pipe(
        startWith(this.ticketId()),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((ticketId: number) => {
        if (ticketId) {
          this.loadComments();
          this.getAuthorId();
        }
      });
  }

  openChange(opened: boolean) {
    if (!opened) {
      this.selectedComment.set(null);
    }
    this.subFormOpened = opened;
  }

  loadComments() {
    this.commentService
      .getByTicketId(this.ticketId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((comments: Comment[]) => {
        if (comments) {
          this.comments.set(comments);
        }
      });
  }

onEdit(comment: Comment) {
  this.selectedComment.set(comment);
  this.subFormOpened = true;
}

onDelete(id: number) {
  this.commentService
    .delete(id)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe();
}

getAuthorId() {
  this.authService.getUserConnectedId().pipe(
    takeUntilDestroyed(this.destroyRef)
  ).subscribe((id) => {
    this.userConnectedId.set(id ?? null);
  });
}
onSaved() {
  this.subFormOpened = false;
  this.loadComments();
}
}
