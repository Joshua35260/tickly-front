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

import { InputComponent } from '../../../shared/common/input/input.component';
import { AuthService } from '../../../core/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { WidgetTitleComponent } from '@app/shared/common/widget-title/widget-title.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, InputComponent, ReactiveFormsModule, ButtonModule, WidgetTitleComponent],
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
          this.router.navigate(['/']);
        } else {
          console.error('Sign-in failed');
        }
      });
  }
}
