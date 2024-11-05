import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, OnInit, ViewChild, model, output, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { environment } from 'environments/environment';
import { Observable, startWith } from 'rxjs';


@Component({
  selector: 'app-avatar-upload',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './avatar-upload.component.html',
  styleUrls: ['./avatar-upload.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
  ],
})

export class AvatarUploadComponent implements OnInit, AfterViewInit {
  @ViewChild('fileInput') fileInput: ElementRef;

  avatarUrlFromParent = model<string>();
  avatarUrlFromParent$: Observable<string> = toObservable(this.avatarUrlFromParent);

  fileSelected = output<File>();
  deleteAvatar = output<void>();

  fileToUpload = signal<File>(null);
  imageUrl = signal<string>(null);
 
  constructor(
    private destroyRef: DestroyRef,
  ) {
  }

  ngOnInit() {
    this.avatarUrlFromParent$.pipe(
      startWith(this.avatarUrlFromParent()),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.updateImageUrl()
    });
  }

  ngAfterViewInit() {
    // stop the event propagation of cancel events when the user cancels or close the file selection dialog, otherwise the modal will close too
    this.fileInput.nativeElement.addEventListener('cancel', (evt) => {
      evt.stopPropagation();
    });
  }

  updateImageUrl() {
    if (!!this.avatarUrlFromParent()) {
      let imageUrl = `${environment.baseUrl}${this.avatarUrlFromParent()}`;
      this.imageUrl.set(imageUrl);
    } else {
      this.imageUrl.set(null);
    }
  }


  onFileSelected(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.fileToUpload.set(fileList[0]);
      this.fileSelected.emit(this.fileToUpload());
    }
  }

  onDeleteAvatar() {
    this.fileToUpload.set(null);
    this.avatarUrlFromParent.set(null);
    this.deleteAvatar.emit();
  }

  onFileInputClick() {
    this.fileInput.nativeElement.click();
  }

  getImagePreviewFromUpload() {
    if (this.fileToUpload()) {
      const reader = new FileReader();
      reader.readAsDataURL(this.fileToUpload());
      reader.onload = (_event) => {
        this.imageUrl.set(reader.result as string);
      };
      return this.imageUrl();
    } else {
      return null;
    }
  }


}