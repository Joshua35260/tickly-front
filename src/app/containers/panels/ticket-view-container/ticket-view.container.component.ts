import { TicketService } from './../../../core/services/ticket.service';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { RightPanelSection } from '@app/core/models/enums/right-panel-section.enum';
import { Ticket } from '@app/core/models/ticket.class';
import { AuthService } from '@app/core/services/auth.service';
import { TicketViewComponent } from '@app/features/ticket/ticket-view/ticket-view.component';
import { SidebarComponent } from '@app/shared/common/layout/sidebar/sidebar.component';
import { MenuSidebar } from '@app/shared/common/layout/sidebar/sidebar.model';

@Component({
  selector: 'app-ticket-view-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ticket-view.container.component.html',
  standalone: true,
  imports: [CommonModule, TicketViewComponent, SidebarComponent],
})

export class TicketViewContainerComponent {
  userId = signal<number>(null);
  ticket = signal<Ticket>(null);
  // Computed qui met à jour le menu selon l'utilisateur connecté et l'état du ticket
  dataMenu = computed<MenuSidebar[]>(() => {
    const menu = [
      {
        panel: RightPanelSection.RIGHT_PANEL_SECTION_INFO,
        title: '',
        icon: 'icon-information',
        iconSpan: 0,
      },
      {
        panel: RightPanelSection.RIGHT_PANEL_SECTION_CHAT,
        title: '',
        icon: 'icon-talk',
        iconSpan: 0,
        hide: !this.ticket()?.assignedUsers?.some(
          (user) => user.id === this.userId()
        ), // cache l'onglet si l'utilisateur n'est pas assigné
      },
      {
        panel: RightPanelSection.RIGHT_PANEL_SECTION_HISTORICAL,
        title: '',
        icon: 'icon-history',
        iconSpan: 0,
      },
      {
        panel: RightPanelSection.RIGHT_PANEL_SECTION_ACTIONS,
        title: '',
        icon: 'icon-choice',
        iconSpan: 0,
      },
    ];
    return menu;
  });

  get ticketId(): number {
    return this.route.snapshot.params['id'];
  }

  get section(): RightPanelSection {
    return this.route.snapshot.params['section'];
  }

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected destroyRef: DestroyRef,
    private ticketService: TicketService,
    private authService: AuthService
  ) {
    this.getUserConnectedId();
    this.getTicket();

    this.ticketService.entityChanged$ //recharge le ticket automatiquement si le ticket est modifié
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.getTicket());
  }


  getUserConnectedId() {
    this.authService.getUserConnectedId().subscribe((id) => {
      this.userId.set(id);
    });
  }

  getTicket() {
    this.ticketService
      .getById(this.ticketId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((ticket: Ticket) => {
        if (ticket) {
          this.ticket.set(ticket);
        }
      });
  }

  isAssigned(): boolean {
    let assigned = false;
    this.ticketService
      .getById(this.ticketId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((ticket: Ticket) => {
        assigned = ticket?.assignedUsers?.some(
          (user) => user.id === this.userId()
        );
      });
    return assigned;
  }

  onPanelSelected(panel: string) {
    this.router.navigate(
      [{ outlets: { panel: ['ticket', 'view', this.ticketId, panel] } }],
      { queryParamsHandling: 'preserve' }
    );
  }

  onEditTicket(ticketId: number) {
    this.router.navigate(
      [{ outlets: { modal: ['ticket', 'edit', ticketId] } }],
      { queryParamsHandling: 'preserve' }
    );
  }

  onTicketDeleted() {
    this.router.navigate([{ outlets: { panel: null } }], {
      queryParamsHandling: 'preserve',
    });
  }

  close() {
    this.router.navigate([{ outlets: { panel: null } }], {
      queryParamsHandling: 'preserve',
    });
  }
}
