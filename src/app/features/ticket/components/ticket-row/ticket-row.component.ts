import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, input, output, signal, ViewChild } from '@angular/core';
import { CategoryLabels } from '@app/core/models/enums/category.enum';
import { PriorityLabels } from '@app/core/models/enums/priority.enum';
import { getStatusClass, getStatusIcon, Status, StatusLabels } from '@app/core/models/enums/status.enum';
import { Ticket } from '@app/core/models/ticket.class';
import { AvatarComponent } from '@app/shared/common/avatar/avatar.component';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-ticket-row',
  templateUrl: './ticket-row.component.html',
  styleUrls: ['./ticket-row.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports : [
    CommonModule,
    MenuModule,
    AvatarComponent,
  ]
})
export class TicketRowComponent  implements AfterViewInit {
  @ViewChild('cardTop') cardTopElement: ElementRef;
  @ViewChild('cardBottom') cardBottomElement: ElementRef;
  menuOpened = output<number>();
  openTicket = output<number>()
  ticket = input.required<Ticket>();

  avatarTopHeight = signal<number>(undefined);
  avatarTopWidth = signal<number>(undefined);
  avatarBottomHeight = signal<number>(undefined);
  avatarBottomWidth = signal<number>(undefined);
  iconColor = signal<string>('');
  get CategoryLabels() {
    return this.ticket()
      .category.map((cat) => CategoryLabels[cat])
      .join(', ');
  }
  PriorityLabels = PriorityLabels;
  StatusLabels = StatusLabels;
  getStatusIcon = getStatusIcon;
  getStatusClass = getStatusClass;
  constructor() { }

  ngAfterViewInit() {
    this.avatarTopHeight.set(parseInt(getComputedStyle(this.cardTopElement.nativeElement).getPropertyValue('--avatar-height-top').trim(),10));
    this.avatarTopWidth.set(parseInt(getComputedStyle(this.cardTopElement.nativeElement).getPropertyValue('--avatar-width-top').trim(), 10));
    if (this.ticket().author) {
      this.avatarBottomHeight.set(parseInt(getComputedStyle(this.cardBottomElement.nativeElement).getPropertyValue('--avatar-height-bottom').trim(), 10));
      this.avatarBottomWidth.set(parseInt(getComputedStyle(this.cardBottomElement.nativeElement).getPropertyValue('--avatar-width-bottom').trim(), 10));
    }

    this.loadInfoBasedOnStatus();
  }

  withMenu = input<boolean>();
  menuItems = input<MenuItem[]>();

  onMenuOpen() {
    this.menuOpened.emit(this.ticket().id);
  }
  
  loadInfoBasedOnStatus() {
    if (this.ticket().status === Status.IN_PROGRESS) {
      this.iconColor.set('progress');
    } else if (this.ticket().status === Status.CLOSED) {
      this.iconColor.set('closed');
    } else if (this.ticket().status === Status.OPEN) {
      this.iconColor.set('open');
    }
  }

}
