import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoginComponent, RegisterComponent]
})
export class AuthComponent implements OnInit {
  switchView = signal<boolean>(false);
  constructor() { }

  ngOnInit() {
  }
  onShowRegister() {

  }
}
