import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputComponent } from '../../../shared/common/input/input.component';
import { AuthService } from '../../../core/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    InputComponent,
    ReactiveFormsModule,
    CheckboxModule,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  loginFilled = signal<boolean>(false);
  formSubmitted: boolean;

switchView = output<void>();
  constructor(
    private authService: AuthService,
    private router: Router,
    private destroyRef: DestroyRef
  ) {
    this.loginForm = new FormGroup({
      login: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      remember: new FormControl(false),
    });
  }

  onSubmitUsername() {
    this.loginFilled.set(true);
  }

  backtoLogin() {
    this.loginFilled.set(false);
  }
 
  onSignin() {
    this.authService
      .signIn(this.loginForm.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((auth) => {
        if (auth) {
          console.log('auth in component', auth);
          this.router.navigate(['/']);
        } else {
          console.error('Sign-in failed');
        }
      });
  }
}
