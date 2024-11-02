import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import { Ticket } from '@app/core/models/ticket.class';
import { WidgetTitleComponent } from '@app/shared/common/widget-title/widget-title.component';
import { WidgetComponent } from '@app/shared/common/widget/widget.component';

@Component({
  selector: 'app-ticket-chat',
  templateUrl: './ticket-chat.component.html',
  styleUrls: ['./ticket-chat.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    WidgetComponent,
    WidgetTitleComponent
  ]
})
export class TicketChatComponent implements OnInit {
  ticket = input<Ticket>(null);
  constructor() { }

  ngOnInit() {
  }

}
