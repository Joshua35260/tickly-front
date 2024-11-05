import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RightPanelSection } from '@app/core/models/enums/right-panel-section.enum';
import { TicketCreateEditComponent } from '@app/features/ticket/components/ticket-create-edit/ticket-create-edit.component';



@Component({
  selector: 'app-ticket-create-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ticket-create.container.component.html',
  standalone: true,
  imports: [
    TicketCreateEditComponent,
  ]
})

export class TicketCreateContainerComponent {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  get ticketId(): number {
    return this.route.snapshot.params['id'];
  }

  close() {
    this.router.navigate([{ outlets: { modal: null } }], { queryParamsHandling: 'preserve' });
  }

  openTicket(ticketId: number) {
    if (this.route.snapshot.queryParams['doNotOpenAfterCreate']) {
      this.close();
    }
    if (ticketId) {
      this.router.navigate([{
        outlets: {
            modal: null,  // Clear the modal outlet
            panel: ['ticket', 'view', ticketId, RightPanelSection.RIGHT_PANEL_SECTION_INFO]  // Define the panel outlet
        }
    }], { queryParamsHandling: 'preserve' });
    
    } else {
      this.close();
    }
  }
  
}
