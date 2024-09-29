import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { RightPanelSection } from '@app/core/models/enums/right-panel-section.enum';
import { UserListComponent } from '@app/features/user/user-list/user-list.component';

@Component({
  selector: 'app-user-list.container',
  templateUrl: './user-list-container.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UserListComponent,
  ]
})
export class UserListContainerComponent  {

  constructor(
    protected router: Router,
  ) {}
  displayUserView(userId: number) {
    this.router.navigate([{ outlets: { panel: [ 'user', 'view', userId, RightPanelSection.RIGHT_PANEL_SECTION_INFO ] } }], { queryParamsHandling: 'preserve' });
  }

}
