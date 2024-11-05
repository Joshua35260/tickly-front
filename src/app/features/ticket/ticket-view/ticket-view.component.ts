import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { RightPanelSection } from '@app/core/models/enums/right-panel-section.enum';
import { Ticket } from '@app/core/models/ticket.class';
import { TicketService } from '@app/core/services/ticket.service';
import { ModalConfirmDeleteComponent } from '@app/shared/common/modal-confirm-delete/modal-confirm-delete.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TicketInfoComponent } from '../components/ticket-info/ticket-info.component';
import { WidgetTitleComponent } from '@app/shared/common/widget-title/widget-title.component';
import { AuditLogComponent } from '@app/shared/audit-log/audit-log.component';
import { LinkedTable } from '@app/core/models/enums/linked-table.enum';
import { CommentListComponent } from '@app/shared/comment/comment-list/comment-list.component';
@Component({
  selector: 'app-ticket-view',
  templateUrl: './ticket-view.component.html',
  styleUrls: ['./ticket-view.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ModalConfirmDeleteComponent,
    ButtonModule,
    TicketInfoComponent,
    WidgetTitleComponent,
    AuditLogComponent,
    CommentListComponent,
  ],
})
export class TicketViewComponent {
  LinkedTable = LinkedTable;
  
  sectionDisplayed = input<RightPanelSection>();
  ticket = input<Ticket>(null);

  edit = output<number>();
  deleted = output<void>();
  showDeleteModal = signal<boolean>(false);

  get sectionInfoDisplayed() {
    return (
      this.sectionDisplayed() === RightPanelSection.RIGHT_PANEL_SECTION_INFO
    );
  }

  get sectionActionsDisplayed() {
    return (
      this.sectionDisplayed() === RightPanelSection.RIGHT_PANEL_SECTION_ACTIONS
    );
  }

  get sectionChatDisplayed() {
    return (
      this.sectionDisplayed() === RightPanelSection.RIGHT_PANEL_SECTION_CHAT
    );
  }

  get sectionHistoricalDisplayed() {
    return (
      this.sectionDisplayed() === RightPanelSection.RIGHT_PANEL_SECTION_HISTORICAL
    );
  }

  constructor(
    private ticketService: TicketService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  onEdit(ticketId: number) {
    this.edit.emit(ticketId);
  }

  onDelete() {
    this.ticketService.delete(this.ticket().id).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Le ticket a été supprimé avec succès',
      });
      this.deleted.emit();
    });
  }

  onArchive(isArchived: boolean) {
    this.confirmationService.confirm({
      message: isArchived
        ? 'Voulez-vous désarchiver ce ticket?'
        : 'Voulez-vous archiver ce ticket?',
      icon: 'icon-warning',
      header: 'Confirmation',
      dismissableMask: true,
      accept: () => {
        this.ticketService
          .update(
            {
              ...this.ticket(),
              archivedAt: isArchived ? null : new Date(), // Met à jour en fonction de isArchived
            },
            this.ticket().id
          )
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succes',
                detail: `Le ticket est ${
                  isArchived ? 'désarchivé' : 'archivé'
                }`,
              });
            },
          });
      },
    });
  }
}
