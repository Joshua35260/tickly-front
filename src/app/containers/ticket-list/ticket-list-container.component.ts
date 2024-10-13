import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { RightPanelSection } from '@app/core/models/enums/right-panel-section.enum';
import { TicketListComponent } from '@app/features/ticket/ticket-list/ticket-list.component';

@Component({
  selector: 'app-ticket-list.container',
  templateUrl: './ticket-list-container.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TicketListComponent,
  ]
})
export class TicketListContainerComponent  {

  constructor(
    protected router: Router,
  ) {}
  displayTicketView(ticketId: number) {
    this.router.navigate([{ outlets: { panel: [ 'ticket', 'view', ticketId, RightPanelSection.RIGHT_PANEL_SECTION_INFO ] } }], { queryParamsHandling: 'preserve' });
  }

}
