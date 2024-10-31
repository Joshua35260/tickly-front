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
import { StructureService } from '@app/core/services/structure.service';
import { DropdownModule } from 'primeng/dropdown';
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
    WidgetTitleComponent,
  ],
})
export class RegisterComponent {
  switchView = output<void>();
  registerForm: FormGroup;
  constructor(
    private userService: UserService,
    private structureService: StructureService,
    private destroyRef: DestroyRef
  ) {
    this.registerForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      login: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('',),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      address: new FormGroup({
        streetL1: new FormControl('', [Validators.required]),
        streetL2: new FormControl(''),
        postcode: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
      }),
    });
    
  }

  

  onSubmit() {
    if (this.registerForm.valid) {
      const registrationData = this.registerForm.value;
    
      this.userService
        .create(registrationData)
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
}
