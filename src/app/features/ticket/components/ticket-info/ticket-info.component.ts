import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  output,
} from '@angular/core';
import { RightPanelSection } from '@app/core/models/enums/right-panel-section.enum';
import { Ticket } from '@app/core/models/ticket.class';
import { AuthService } from '@app/core/services/auth.service';
import { TicketService } from '@app/core/services/ticket.service';
import { AvatarComponent } from '@app/shared/common/avatar/avatar.component';
import { WidgetTitleComponent } from '@app/shared/common/widget-title/widget-title.component';
import { WidgetComponent } from '@app/shared/common/widget/widget.component';
import { ButtonModule } from 'primeng/button';
import { UserRowComponent } from '../../../user/components/user-row/user-row.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CategoryLabels } from '@app/core/models/enums/category.enum';
import { PriorityLabels } from '@app/core/models/enums/priority.enum';
import {
  getStatusClass,
  getStatusIcon,
  Status,
  StatusLabels,
} from '@app/core/models/enums/status.enum';
import { Router } from '@angular/router';

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
    ButtonModule,
    UserRowComponent,
    UserRowComponent,
  ],
})
export class TicketInfoComponent implements OnInit {
  saved = output<void>();

  ticket = input<Ticket>();
  sectionDisplayed = input<RightPanelSection>();

  edit = output<number>();
  userId: number;

  PriorityLabels = PriorityLabels;
  StatusLabels = StatusLabels;
  get CategoryLabels() {
    return this.ticket()
      .category.map((cat) => CategoryLabels[cat])
      .join(', ');
  }
  getStatusIcon = getStatusIcon;
  getStatusClass = getStatusClass;
  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getUserConnectedId();
  }

  update() {
    this.edit.emit(this.ticket().id);
  }

  get isAssigned() {
    return this.ticket().assignedUsers.some((user) => user.id === this.userId);
  }

  getUserConnectedId() {
    this.authService.getUserConnectedId().subscribe((id) => {
      this.userId = id; // Récupérer l'ID de l'utilisateur connecté
    });
  }

  onAssignTicket() {
    if (this.userId) {
      this.ticketService
        .assignUserToTicket(this.ticket().id, this.userId)
        .subscribe({
          next: () => {
            this.ticket().status = Status.IN_PROGRESS;
            this.ticketService
              .update(this.ticket(), this.ticket().id)
              .subscribe({
                next: () => {
                  this.saved.emit();
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail:
                      'Le ticket est désormais assigné et en cours de traitement',
                  });
                },
              });
          },
        });
    }
  }

  onDelete(userId: number) {
    this.confirmationService.confirm({
      message: 'Voulez-vous vraiment enlever l’utilisateur de ce ticket ?',
      accept: () => {
        this.ticketService
          .removeUserFromTicket(this.ticket().id, userId)
          .subscribe({
            next: () => {
              this.ticketService
                .removeUserFromTicket(this.ticket().id, userId)
                .subscribe({
                  next: () => {
                    this.saved.emit();
                  },
                });
            },
          });
      },
    });
  }

  displayUserView(userId: number) {
    this.router.navigate([{ outlets: { panel: [ 'user', 'view', userId, RightPanelSection.RIGHT_PANEL_SECTION_INFO ] } }], { queryParamsHandling: 'preserve' });
  }

  displayStructureView(structureId: number) {
    this.router.navigate([{ outlets: { panel: [ 'structure', 'view', structureId, RightPanelSection.RIGHT_PANEL_SECTION_INFO ] } }], { queryParamsHandling: 'preserve' });
  }
  
}
