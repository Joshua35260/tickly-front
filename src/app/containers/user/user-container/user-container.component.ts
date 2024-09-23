import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserListComponent } from '@app/features/user/user-list/user-list.component';

@Component({
  selector: 'app-user.container',
  templateUrl: './user-container.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UserListComponent,
  ]
})
export class UserContainerComponent  {


}
