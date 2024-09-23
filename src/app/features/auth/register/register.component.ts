import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from '../../../core/models/user.class';
import { UserService } from '../../../core/services/user.service';
import { InputComponent } from '../../../shared/common/input/input.component';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    InputComponent,
    ReactiveFormsModule,
    ButtonModule,
    PasswordModule,
    FloatLabelModule,
  ],
})
export class RegisterComponent {
  registerForm: FormGroup;

  switchView = output<void>();

  constructor(
    private userService: UserService,
    private router: Router,
    private destroyRef: DestroyRef
  ) {
    this.registerForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      login: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)]),
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const registrationData = this.registerForm.value;

      this.userService
        .registerUser(registrationData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => this.switchView.emit(),
          error: (error) => console.error('Registration failed', error)
        });
    }
  }
}
