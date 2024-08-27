import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthComponent } from '../../features/auth/auth/auth.component';

@Component({
  selector: 'app-auth-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auth-container.component.html',
  imports: [AuthComponent],
})
export class LoginContainerComponent {}
