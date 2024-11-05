import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserCreateEditComponent } from '@app/features/user/components/user-edit/user-create-edit.component';

@Component({
  selector: 'app-user-create-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-create-container.component.html',
  standalone: true,
  imports: [UserCreateEditComponent],
})
export class UserCreateContainerComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}

  get userId(): number {
    return this.route.snapshot.params['id'];
  }

  close() {
    this.router.navigate([{ outlets: { modal: null } }], {
      queryParamsHandling: 'preserve',
    });
  }

  openUser(userId: number) {
    if (this.route.snapshot.queryParams['doNotOpenAfterCreate']) {
      this.close();
    }
    if (userId) {
      this.router.navigate([{ outlets: { panel: ['user', 'view', userId] } }], {
        queryParamsHandling: 'preserve',
      });
    } else {
      this.close();
    }
  }
}
