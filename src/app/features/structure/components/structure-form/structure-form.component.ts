import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  output,
  DestroyRef,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { Structure } from '@app/core/models/structure.class';
import { User } from '@app/core/models/user.class';
import { MediaService } from '@app/core/services/media.service';
import { StructureService } from '@app/core/services/structure.service';
import { AvatarUploadComponent } from '@app/shared/common/avatar-upload/avatar-upload.component';
import { InputComponent } from '@app/shared/common/input/input.component';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MultiSelectModule } from 'primeng/multiselect';
import { distinctUntilChanged, of, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-structure-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './structure-form.component.html',
  styleUrls: ['structure-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MultiSelectModule,
    ButtonModule,
    InputComponent,
    InputSwitchModule,
    DropdownModule,
    AvatarUploadComponent,
  ],
})
export class StructureFormComponent implements OnInit {
  saved = output<number>();
  cancel = output<void>();
  structure = input<Structure>();
  structure$ = toObservable(this.structure);
  structureForm: FormGroup;

  avatarToUpload = signal<File>(null);
  deleteAvatar: boolean = false;

  constructor(
    private destroyRef: DestroyRef,
    private structureService: StructureService,
    private mediaService: MediaService
  ) {
    this.structure$
      .pipe(
        startWith(this.structure()),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((structure) => {
        if (structure) {
          this.structureForm.patchValue(structure);
        }
      });
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.structureForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]), // Valeur associée au type de contact
      phone: new FormControl(''),
      service: new FormControl(''),
      type: new FormControl(''),
      address: new FormGroup({
        streetL1: new FormControl(''),
        streetL2: new FormControl(''),
        postcode: new FormControl(''),
        city: new FormControl(''),
        country: new FormControl(''),
      }),
    });
  }

  onSave() {
    if (this.structureForm.valid) {
      const structureData: Structure = { ...this.structureForm.value };
      if (this.structure()?.id) {
        this.structureService
          .update(structureData, this.structure().id)
          .pipe(
            takeUntilDestroyed(this.destroyRef),
            switchMap((updatedStructure: Structure) => {
              if (this.avatarToUpload()) {
                return this.mediaService.uploadSingleFile(
                  this.avatarToUpload(),
                  { structureId: updatedStructure.id }
                );
              } else if (this.deleteAvatar) {
                return this.mediaService.delete(updatedStructure.avatarId);
              } else {
                return of(updatedStructure);
              }
            })
          )
          .subscribe((structureUpdated: Structure) => {
            this.saved.emit(structureUpdated.id);
          });
      } else {
        this.structureService
          .create(structureData)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((structureCreated: Structure) => {
            this.saved.emit(structureCreated.id);
          });
      }
    }
  }

  onCancel() {
    this.structureForm.reset();
    this.cancel.emit();
  }
  onFileSelected(file: File) {
    if (file) {
      this.avatarToUpload.set(file);
    } else {
      this.avatarToUpload.set(null);
    }
  }

  onDeleteAvatar() {
    this.avatarToUpload.set(null);
    this.deleteAvatar = true;
  }
}
