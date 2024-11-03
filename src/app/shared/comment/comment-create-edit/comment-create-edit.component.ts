import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  input,
  output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { CommentService } from '@app/core/services/comment.service';
import { AvatarComponent } from '@app/shared/common/avatar/avatar.component';
import { InputComponent } from '@app/shared/common/input/input.component';
import { TextAreaComponent } from '@app/shared/common/text-area/text-area.component';
import { WidgetTitleComponent } from '@app/shared/common/widget-title/widget-title.component';
import { Comment } from '@app/core/models/comment.class';
@Component({
  selector: 'app-comment-create-edit',
  templateUrl: './comment-create-edit.component.html',
  styleUrls: ['./comment-create-edit.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    WidgetTitleComponent,
    ReactiveFormsModule,
    InputComponent,
    TextAreaComponent,
    AvatarComponent,
    ButtonModule,
  ],
})
export class CommentCreateEditComponent implements OnInit {
  commentForm: FormGroup;
  ticketId = input.required<number>();

  userConnectedId = input.required<number>();
  cancel = output<void>();
  saved = output<void>();
  selectedComment = input<Comment>(null);
  selectedComment$ = toObservable(this.selectedComment);
  constructor(
    private commentService: CommentService,
    private destroyRef: DestroyRef
  ) {
    this.selectedComment$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((comment) => {
        if (comment) {
          this.commentForm.patchValue(comment);
        }
      });
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.commentForm = new FormGroup({
      content: new FormControl('', [
        Validators.required,
        Validators.maxLength(2000),
      ]),
      ticketId: new FormControl(this.ticketId(), Validators.required),
      authorId: new FormControl(this.userConnectedId(), Validators.required),
    });
  }
  onSubmit() {
    if (this.commentForm.valid) {
      const commentData = {
        ...this.selectedComment(),
        ...this.commentForm.value,
      };
      if (!this.selectedComment()) {
        this.commentService
          .create(commentData)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.saved.emit();
            },
          });
      } else {
        this.commentService
          .update(commentData, this.selectedComment()?.id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.saved.emit();
            },
          });
      }
    }
  }
}
