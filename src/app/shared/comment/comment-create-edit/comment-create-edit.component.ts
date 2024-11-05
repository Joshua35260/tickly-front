import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  ViewChild,
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
import { MediaService } from '@app/core/services/media.service';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { FilesizePipe } from '../../pipes/filesize.pipe';
import { switchMap, take } from 'rxjs';
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
    FileUploadModule,
    FilesizePipe,
  ],
})
export class CommentCreateEditComponent implements OnInit {
  @ViewChild(FileUpload) fileUpload: FileUpload;
  commentForm: FormGroup;
  ticketId = input.required<number>();

  userConnectedId = input.required<number>();
  cancel = output<void>();
  saved = output<void>();
  selectedComment = input<Comment>(null);
  selectedComment$ = toObservable(this.selectedComment);

  // Propriétés pour l'image
  selectedFile: File | null = null;

  constructor(
    private commentService: CommentService,
    private destroyRef: DestroyRef,
    private mediaService: MediaService
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
      content: new FormControl('', [Validators.required, Validators.maxLength(2000)]),
      ticketId: new FormControl(this.ticketId(), Validators.required),
      authorId: new FormControl(this.userConnectedId(), Validators.required),
    });
  }

  onFileSelected(event: any) {
    if (event.files && event.files.length > 0) {
      this.selectedFile = event.files[0];
    }
  }
  
  onDeleteDoc(comment: Comment) {
    if (comment.mediaId) {
      this.mediaService.delete(comment.mediaId).pipe(
      ).subscribe({
        next: () => {
          this.saved.emit();
        },  
      });
    } else {
      console.warn('Aucun média associé au commentaire pour la suppression.');
    }
  }
  
  
  onSubmit() {
    if (this.commentForm.valid) {
      const commentData = {
        ...this.selectedComment(),
        ...this.commentForm.value,
      };

      const commentObservable = !this.selectedComment()
        ? this.commentService.create(commentData) // Création
        : this.commentService.update(commentData, this.selectedComment().id); // Mise à jour

      commentObservable.pipe(take(1)).subscribe({
        next: (commentUpdated: Comment) => {
          if (this.selectedFile) {
            this.uploadFile(commentUpdated.id);
          } else {
            this.saved.emit(); // Émet l'événement si aucun fichier
          }
        },
        error: (err) => console.error("Erreur lors de la soumission :", err),
      });
    }
  }

  uploadFile(commentId: number) {
    if (this.selectedFile) {
      const dto = { commentId: commentId };

      this.mediaService.uploadSingleFile(this.selectedFile, dto).subscribe({
        next: () => {
          this.saved.emit(); // Émet l'événement de sauvegarde après le téléchargement
          this.removeSelectedFile(); // Réinitialise le fichier sélectionné
        },
        error: (err) => console.error("Erreur lors de l'envoi du fichier :", err),
      });
    }
  }

  removeSelectedFile() {
    this.selectedFile = null;
    this.fileUpload.clear(); // Réinitialise l'interface de téléchargement
  }
}