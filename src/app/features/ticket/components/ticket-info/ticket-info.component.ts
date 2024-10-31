import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, OnInit, output } from '@angular/core';
import { RightPanelSection } from '@app/core/models/enums/right-panel-section.enum';
import { Ticket } from '@app/core/models/ticket.class';
import { AuthService } from '@app/core/services/auth.service';
import { TicketService } from '@app/core/services/ticket.service';
import { AvatarComponent } from '@app/shared/common/avatar/avatar.component';
import { WidgetTitleComponent } from '@app/shared/common/widget-title/widget-title.component';
import { WidgetComponent } from '@app/shared/common/widget/widget.component';
import { ButtonModule } from 'primeng/button';
import { UserRowComponent } from "../../../user/components/user-row/user-row.component";
import { MenuItem, ConfirmationService } from 'primeng/api';

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
]
})
export class TicketInfoComponent implements OnInit {
  saved = output<void>();

  ticket = input<Ticket>();
  sectionDisplayed = input<RightPanelSection>();
  
  edit = output<number>();
  userId: number;
  get formattedCategories(): string {
    return this.ticket().category.map(cat => cat.category).join(', ');
  }

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.getUserConnectedId();
  }
  update() {
    this.edit.emit(this.ticket().id);
  }
  getUserConnectedId() {
    this.authService.getUserConnectedId().subscribe(id => {
      this.userId = id; // Récupérer l'ID de l'utilisateur connecté
      console.log('User ID:', this.userId);
    });
  }

  onAssignTicket() {
    if (this.userId) {
      this.ticketService.assignUserToTicket(this.ticket().id, this.userId).subscribe({
        next: () => {
          this.saved.emit();
        },
        error: (error) => {
          console.error('Error assigning user to ticket:', error)
        },
      });
    } 
  }
  onDelete(userId: number ) {
    this.confirmationService.confirm({
      message: 'Voulez-vous vraiment enlever l’utilisateur de ce ticket ?',
      accept: () => {
        this.ticketService.removeUserFromTicket(this.ticket().id, userId).subscribe({
          next: () => {
            this.ticketService.removeUserFromTicket(this.ticket().id, userId).subscribe({
              next: () => {
                this.saved.emit();
              },
              error: (error) => {
                console.error('Error removing user from ticket:', error)
              },
            })
          },
          error: (error) => {
            console.error('Error removing user from ticket:', error)
          },
        });
      },
    });
  }
  
}
