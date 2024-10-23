import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserCreateEditComponent } from '@app/features/user/components/user-edit/user-create-edit.component';


@Component({
  selector: 'app-user-edit-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-edit.container.component.html',
  standalone: true,
  imports: [
    UserCreateEditComponent,
  ]
})

export class UserEditContainerComponent {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  get userId(): number {
    return this.route.snapshot.params['id'];
  }

  close() {
    this.router.navigate([{ outlets: { modal: null } }], { queryParamsHandling: 'preserve' });
  }
}
