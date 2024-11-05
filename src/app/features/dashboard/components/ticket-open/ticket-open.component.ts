import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RightPanelSection } from '@app/core/models/enums/right-panel-section.enum';
import { Ticket } from '@app/core/models/ticket.class';
import { TicketService } from '@app/core/services/ticket.service';
import { TicketRowComponent } from '@app/features/ticket/components/ticket-row/ticket-row.component';
import { WidgetTitleComponent } from '@app/shared/common/widget-title/widget-title.component';
import { WidgetComponent } from '@app/shared/common/widget/widget.component';

@Component({
  selector: 'app-ticket-open',
  templateUrl: './ticket-open.component.html',
  styleUrls: ['./ticket-open.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    WidgetTitleComponent,
    WidgetComponent,
    TicketRowComponent,
  ]
})
export class TicketOpenComponent implements OnInit {
  tickets= signal<Ticket[]>([]);
  numberOfTickets = signal<number>(0);
  constructor(
    private ticketService: TicketService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.ticketService.getTicketsOpen().subscribe(data => {
      this.numberOfTickets.set(data.count);
      this.tickets.set(data.tickets.sort((a, b) => b.id - a.id));
    });
  }
  
  displayTicketView(ticketId: number) {
    this.router.navigate([{ outlets: { panel: [ 'ticket', 'view', ticketId, RightPanelSection.RIGHT_PANEL_SECTION_INFO ] } }], { queryParamsHandling: 'preserve' });
  }
}
