import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { User } from '@app/core/models/user.class';
import { AvatarComponent } from '@app/shared/common/avatar/avatar.component';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-user-row',
  templateUrl: './user-row.component.html',
  styleUrls: ['./user-row.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports : [
    CommonModule,
    MenuModule,
    AvatarComponent,
  ]
})
export class UserRowComponent {
  user = input.required<User>();
  constructor() { }

  menuOpened = output<number>();
  openUser = output<number>();

  withMenu = input<boolean>();
  menuItems = input<MenuItem[]>();

  onMenuOpen() {
    this.menuOpened.emit(this.user().id);
  }
  getRoleNames(): string {
    return this.user().roles.map(role => role.role).join(', ');
  }
}
