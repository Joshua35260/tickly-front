import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketCreateEditComponent } from '@app/features/ticket/components/ticket-create-edit/ticket-create-edit.component';



@Component({
  selector: 'app-ticket-edit-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ticket-edit.container.component.html',
  standalone: true,
  imports: [
    TicketCreateEditComponent,
  ]
})

export class TicketEditContainerComponent {

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
}
