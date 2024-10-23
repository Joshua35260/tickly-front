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
import { jobType, JobTypeDropdown } from '@app/core/models/enums/job-type.enum';
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
import { Email } from '@app/core/models/email.class';
import { Phone } from '@app/core/models/phone.class';
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
  jobTypeId : jobType;
  JobTypeDropdown = JobTypeDropdown;
  isAddStructureModalOpen = false;
  filteredStructures = signal<Structure[]>([]);
  structureLinked = signal<Structure>(null);

  get isEmployee() {
    return this.userForm.get('jobTypeId').value === jobType.EMPLOYEE;
  }
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
      jobTypeId: new FormControl(jobType, [Validators.required]),
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
            .getUser(id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((user: User) => {
              this.user.set(user);
              console.log(this.user());
              console.log('User ID:', this.userId(), 'Type:', typeof this.userId());
              this.userForm.patchValue(user);
            });
        }
      });

    this.onJobTypeChange();
  }



  onJobTypeChange() {
    this.userForm
      .get('jobTypeId')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: jobType) => {
        this.toggleAddressFields(value);
      });
  }


  toggleAddressFields(job: jobType) {
    const addressGroup = this.userForm.get('address') as FormGroup;

    if (job === jobType.EMPLOYEE) {
      this.userForm.get('structure')?.enable();

      Object.keys(addressGroup.controls).forEach((key) => {
        this.userForm.get('structure')?.enable();
        const control = addressGroup.get(key);
        control?.setValidators(null);
        control?.updateValueAndValidity();
      });
    } else {
      this.userForm.get('structure')?.disable();

      Object.keys(addressGroup.controls).forEach((key) => {
        const control = addressGroup.get(key);
        control?.enable();
        if (['streetL1', 'postcode', 'city', 'country'].includes(key)) {
          control?.setValidators([Validators.required]);
        }
        control?.updateValueAndValidity();
      });
    }

    addressGroup.updateValueAndValidity();
    this.userForm.updateValueAndValidity();
  }

  onSubmit() {
    if (this.userForm.valid) {
      const userData = { ...this.userForm.value };
  
      if (this.isEmployee) {
        const linkedStructure = this.structureLinked();
        if (linkedStructure) {
          userData.structures = [linkedStructure.id]; // Si une structure est liée, l'ajoute à userData
        } else {
          console.error('No structure linked for employee.');
          return; // Ne pas continuer si aucune structure n'est liée
        }
      } else {
        delete userData.structures; // Supprime la propriété si ce n'est pas un employé
      }
  
   // UPDATE
      if (this.userId()) {
        userData.id = this.userId();
        this.userService
          .updateUser(userData)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => this.saved.emit(),
            error: (error) => console.error('User update failed', error),
          });
      } else {
        // ADD
        this.userService
          .registerUser(userData)
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
