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
import { startWith } from 'rxjs';

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


  constructor(
    private userService: UserService,
    private structureService: StructureService,
    private destroyRef: DestroyRef
  ) {
    this.userForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      login: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.minLength(4),]),
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
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        startWith(this.userId()),
      )
      .subscribe((id: number) => {
        if (id) {
          this.userService
            .getById(id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((user: User) => {
              this.user.set(user);
              this.userForm.patchValue(user);
            });
        }
      });
  }




  onSubmit() {
    if (this.userForm.valid) {
      const userData = { ...this.userForm.value };
  
   // UPDATE
      if (this.userId()) {
        userData.id = this.userId();
        this.userService
          .update(userData)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => this.saved.emit(),
            error: (error) => console.error('User update failed', error),
          });
      } else {
        // ADD
        this.userService
          .create(userData)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => this.saved.emit(),
            error: (error) => console.error('User registration failed', error),
          });
      }
    } else {
      console.error('Form is invalid'); // Log si le formulaire est invalide
    }
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
