import {
  ChangeDetectionStrategy,
  Component,
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '../../../core/services/user.service';
import { InputComponent } from '../../../shared/common/input/input.component';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CommonModule } from '@angular/common';
import { InputSwitchModule } from 'primeng/inputswitch';
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

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
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
export class RegisterComponent {
  switchView = output<void>();
  registerForm: FormGroup;
  jobType = jobType;
  JobTypeDropdown = JobTypeDropdown;
  isAddStructureModalOpen = false;
  filteredStructures = signal<Structure[]>([]);
  structureLinked = signal<Structure>(null);
  constructor(
    private userService: UserService,
    private structureService: StructureService,
    private destroyRef: DestroyRef
  ) {
    this.registerForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      login: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      jobType: new FormControl('', [Validators.required]),
      address: new FormGroup({
        streetL1: new FormControl('', [Validators.required]),
        streetL2: new FormControl(''),
        postcode: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
      }),
    });
    
    this.onJobTypeChange();
  }

  get isEmployee() {
    return this.registerForm.get('jobType').value === jobType.EMPLOYEE;
  }

  onJobTypeChange() {
    this.registerForm
      .get('jobType')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: jobType) => {
        this.toggleAddressFields(value);
      });
  }

  toggleAddressFields(job: jobType) {
    console.log(job);
    if (job === jobType.EMPLOYEE) {
      this.registerForm.get('address')?.disable();
      this.registerForm.get('structure')?.enable();
    } else {
      this.registerForm.get('structure')?.disable();
      this.registerForm.get('address')?.enable();
    }
    this.registerForm.updateValueAndValidity();
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const registrationData = this.registerForm.value;
      
      if (this.isEmployee) {
        if (this.structureLinked()) {
          registrationData.structures = [this.structureLinked().id];
        } else {
          console.error('No structure linked for employee.');
          return;
        }
      } else {
        delete registrationData.structures;
      }
  
      console.log('registrationData to send', registrationData);
      
      // Enregistrer l'utilisateur
      this.userService
        .registerUser(registrationData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => this.switchView.emit(),
          error: (error) => console.error('User registration failed', error),
        });
    }
  }
  

  resetForm() {
    this.registerForm.reset();
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
