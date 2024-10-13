import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, OnInit, output } from '@angular/core';
import { RightPanelSection } from '@app/core/models/enums/right-panel-section.enum';
import { Ticket } from '@app/core/models/ticket.class';
import { AvatarComponent } from '@app/shared/common/avatar/avatar.component';
import { WidgetTitleComponent } from '@app/shared/common/widget-title/widget-title.component';
import { WidgetComponent } from '@app/shared/common/widget/widget.component';

@Component({
  selector: 'app-ticket-info',
  templateUrl: './ticket-info.component.html',
  styleUrls: ['./ticket-info.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    WidgetComponent,
    AvatarComponent,
    WidgetTitleComponent,
  ]
})
export class TicketInfoComponent implements OnInit {
  ticket = input<Ticket>();
  sectionDisplayed = input<RightPanelSection>();
  
  edit = output<Ticket>();
  get formattedCategories(): string {
    return this.ticket().category.map(cat => cat.category).join(', ');
  }
  constructor() { }

  ngOnInit() {
  }
  update() {
    this.edit.emit(this.ticket());
  }
}
