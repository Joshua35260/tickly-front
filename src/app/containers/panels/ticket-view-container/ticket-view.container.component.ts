

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RightPanelSection } from '@app/core/models/enums/right-panel-section.enum';
import { TicketViewComponent } from '@app/features/ticket/ticket-view/ticket-view.component';

import { SidebarComponent } from '@app/shared/common/layout/sidebar/sidebar.component';
import { MenuSidebar } from '@app/shared/common/layout/sidebar/sidebar.model';

@Component({
  selector: 'app-ticket-view-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ticket-view.container.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TicketViewComponent,
    SidebarComponent,
  ]
})

export class TicketViewContainerComponent {

  dataMenu = [
    {
      'panel': RightPanelSection.RIGHT_PANEL_SECTION_INFO,
      'title': '',
      'icon': 'icon-information',
      'iconSpan': 0
    },
    {
      'panel': RightPanelSection.RIGHT_PANEL_SECTION_ACTIONS,
      'title': '',
      'icon': 'icon-choice',
      'iconSpan': 0
    }
  ] as MenuSidebar[];

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected destroyRef: DestroyRef,
  ) {
  }

  get ticketId(): number {
    return this.route.snapshot.params['id'];
  }

  get section(): RightPanelSection {
    return this.route.snapshot.params['section'];
  }

  onPanelSelected(panel: string) {
    this.router.navigate([{ outlets: { panel: ['ticket', 'view', this.ticketId, panel] } }], { queryParamsHandling: 'preserve' });
  }

  onEditTicket(ticketId: number) {
    this.router.navigate([{ outlets: { modal: ['ticket', 'edit', ticketId] } }], { queryParamsHandling: 'preserve' });
  }

  onTicketDeleted() {
    this.router.navigate([{ outlets: { panel: null } }], { queryParamsHandling: 'preserve' });
  }

  close() {
    this.router.navigate([{ outlets: { panel: null } }], { queryParamsHandling: 'preserve' });
  }
}
