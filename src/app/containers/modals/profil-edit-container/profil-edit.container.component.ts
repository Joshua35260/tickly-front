import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserCreateEditComponent } from '@app/features/user/components/user-edit/user-create-edit.component';

@Component({
  selector: 'app-profil-edit-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profil-edit.container.component.html',
  standalone: true,
  imports: [
    UserCreateEditComponent,
  ]
})
export class ProfilEditContainerComponent {
    constructor(
      private router: Router,
      private route: ActivatedRoute,
    ) {}

    close() {
      this.router.navigate([{ outlets: { modal: null } }], { queryParamsHandling: 'preserve' });
    }
  
  get userId(): number {
    return this.route.snapshot.params['id'];
  }

  
}
