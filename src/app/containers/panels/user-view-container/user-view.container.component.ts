

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RightPanelSection } from '@app/core/models/enums/right-panel-section.enum';
import { UserViewComponent } from '@app/features/user/user-view/user-view.component';
import { SidebarComponent } from '@app/shared/common/layout/sidebar/sidebar.component';
import { MenuSidebar } from '@app/shared/common/layout/sidebar/sidebar.model';

@Component({
  selector: 'app-user-view-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-view.container.component.html',
  standalone: true,
  imports: [
    CommonModule,
    UserViewComponent,
    SidebarComponent,
  ]
})

export class UserViewContainerComponent {

  dataMenu: MenuSidebar[] = [
      {
        'panel': RightPanelSection.RIGHT_PANEL_SECTION_INFO,
        'title': '',
        'icon': 'icon-information',
        'iconSpan': 0
      },
      {
        'panel': RightPanelSection.RIGHT_PANEL_SECTION_STRUCTURES,
        'title': '',
        'icon': 'icon-organization',
        'iconSpan': 0
      },
      {
        'panel': RightPanelSection.RIGHT_PANEL_SECTION_ACTIONS,
        'title': '',
        'icon': 'icon-choice',
        'iconSpan': 0
      }
    ];



  showStructureMenu = signal<boolean>(false);
  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected destroyRef: DestroyRef,
  ) {
  }

  get userId(): number {
    return this.route.snapshot.params['id'];
  }

  get section(): RightPanelSection {
    return this.route.snapshot.params['section'];
  }

checkIfUserIsEmployee(): boolean {
  return this.route.snapshot.data['isEmployee'];
}
  onPanelSelected(panel: string) {
    this.router.navigate([{ outlets: { panel: ['user', 'view', this.userId, panel] } }], { queryParamsHandling: 'preserve' });
  }

  onEditUser(userId: number) {
    this.router.navigate([{ outlets: { modal: ['user', 'edit', userId] } }], { queryParamsHandling: 'preserve' });
  }

  onUserDeleted() {
    this.router.navigate([{ outlets: { panel: null } }], { queryParamsHandling: 'preserve' });
  }

  close() {
    this.router.navigate([{ outlets: { panel: null } }], { queryParamsHandling: 'preserve' });
  }

  displayStructureView(structureId: number) {
    this.router.navigate([{ outlets: { panel: ['structure', 'view', structureId, RightPanelSection.RIGHT_PANEL_SECTION_INFO] } }], { queryParamsHandling: 'preserve' });
  }
}
