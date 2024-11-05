import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CommonModule } from '@angular/common';
import { StructureService } from '@app/core/services/structure.service';
import { Structure } from '@app/core/models/structure.class';
import { StructureFormComponent } from '@app/features/structure/components/structure-form/structure-form.component';
import { FormDialogComponent } from '@app/shared/common/form-dialog/form-dialog.component';
import { DropdownModule } from 'primeng/dropdown';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { PaginatedData } from '@app/core/models/paginated-data.class';
import { WidgetTitleComponent } from '@app/shared/common/widget-title/widget-title.component';
import { InputComponent } from '@app/shared/common/input/input.component';
import { UserService } from '@app/core/services/user.service';
import { User } from '@app/core/models/user.class';
import { of, startWith, switchMap } from 'rxjs';
import { AvatarUploadComponent } from '@app/shared/common/avatar-upload/avatar-upload.component';
import { MediaService } from '@app/core/services/media.service';

@Component({
  selector: 'app-user-create-edit',
  templateUrl: './user-create-edit.component.html',
  styleUrls: ['./user-create-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    ReactiveFormsModule,
    ButtonModule,
    PasswordModule,
    FloatLabelModule,
    DropdownModule,
    StructureFormComponent,
    FormDialogComponent,
    AutoCompleteModule,
    WidgetTitleComponent,
    AvatarUploadComponent,
  ],
})
export class UserCreateEditComponent {
  userId = input<number>();
  userId$ = toObservable(this.userId);
  user = signal<User>(null);
  saved = output<void>();
  userForm: FormGroup;
  isAddStructureModalOpen = false;
  filteredStructures = signal<Structure[]>([]);
  structureLinked = signal<Structure>(null);

  avatarToUpload = signal<File>(null);
  deleteAvatar: boolean = false;
  constructor(
    private userService: UserService,
    private structureService: StructureService,
    private mediaService: MediaService,
    private destroyRef: DestroyRef
  ) {
    this.userForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      login: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.minLength(4)]),
      phone: new FormControl(''),
      email: new FormControl('', [Validators.required]),
      address: new FormGroup({
        streetL1: new FormControl('', [Validators.required]),
        streetL2: new FormControl(''),
        postcode: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
      }),
    });
    this.userId$
      .pipe(takeUntilDestroyed(this.destroyRef), startWith(this.userId()))
      .subscribe((id: number) => {
        if (id) {
          this.userService
            .getById(id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((user: User) => {
              this.user.set(user);
              const { password, ...userWithoutPassword } = user;
              this.userForm.patchValue(userWithoutPassword);
            });
        }
      });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const userData: User = { ...this.userForm.value };

      if (this.userId()) {
        // UPDATE
        this.userService
          .update(userData, this.userId())
          .pipe(
            takeUntilDestroyed(this.destroyRef),
            switchMap((updatedUser: User) => {
              if (this.avatarToUpload()) {
                return this.mediaService.uploadSingleFile(
                  this.avatarToUpload(),
                  { userId: updatedUser.id }
                );
              } else if (this.deleteAvatar) {
                return this.mediaService.delete(updatedUser.avatarId);
              } else {
                return of(updatedUser);
              }
            })
          )
          .subscribe({
            next: () => this.saved.emit(),
          });
      } else {
        // ADD
        this.userService
          .create(userData)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => this.saved.emit(),
          });
      }
    } else {
      console.error('Form is invalid'); // Log si le formulaire est invalide
    }
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
  resetForm() {
    this.userForm.reset();
  }

  openAddStructure() {
    this.isAddStructureModalOpen = true;
  }

  resetFormDialog() {
    this.isAddStructureModalOpen = false;
  }

  structureCreated(structure: Structure) {
    this.structureLinked.set(structure);
    this.resetFormDialog();
  }

  filterStructures(event: AutoCompleteCompleteEvent) {
    const query = event.query || '';
    if (query.length > 1) {
      this.structureService
        .getAutocompleteStructureByName(query)
        .subscribe((data: PaginatedData<Structure>) => {
          this.filteredStructures.set(data.items);
          this.structureLinked.set(data.items[0]);
        });
    }
  }
}
