import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoginComponent } from '../../features/auth/login/login.component';

@Component({
  selector: 'app-auth-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auth-container.component.html',
  imports: [LoginComponent],
})
export class LoginContainerComponent {}
