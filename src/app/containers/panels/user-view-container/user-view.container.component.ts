import { MediaService } from '@app/core/services/media.service';
import { UserService } from './../../../core/services/user.service';


import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { RightPanelSection } from '@app/core/models/enums/right-panel-section.enum';
import { Ticket } from '@app/core/models/ticket.class';
import { User } from '@app/core/models/user.class';
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

  user = signal<User>(null);
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
        'panel': RightPanelSection.RIGHT_PANEL_SECTION_TICKETS,
        'title': '',
        'icon': 'pi pi-tags',
        'iconSpan': 0,
      },
      {
        'panel': RightPanelSection.RIGHT_PANEL_SECTION_HISTORICAL,
        'title': '',
        'icon': 'icon-history',
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
    private userService: UserService,
    private mediaService: MediaService
  ) {
    this.getUser();
    this.userService.entityChanged$ //recharge le ticket automatiquement si le ticket est modifié
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.getUser());
      
    this.mediaService.entityChanged$ //recharge le ticket automatiquement si le ticket est modifié
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.getUser());
  }

  getUser() {
    this.userService
      .getById(this.userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user: User) => {
        if (user) {
          this.user.set(user);
        }
      });
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
