import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { RightPanelSection } from '@app/core/models/enums/right-panel-section.enum';
import { User } from '@app/core/models/user.class';
import { UserService } from '@app/core/services/user.service';
import { ModalConfirmDeleteComponent } from '@app/shared/common/modal-confirm-delete/modal-confirm-delete.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

import { UserInfoComponent } from '../components/user-info/user-info.component';
import { UserStructuresComponent } from '../components/user-structures/user-structures.component';
import { WidgetTitleComponent } from '../../../shared/common/widget-title/widget-title.component';
import { LinkedTable } from '@app/core/models/enums/linked-table.enum';
import { AuditLogComponent } from '@app/shared/audit-log/audit-log.component';
import { TicketLinkedListComponent } from '@app/shared/ticket-linked-list/ticket-linked-list.component';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ModalConfirmDeleteComponent,
    ButtonModule,
    UserInfoComponent,
    UserStructuresComponent,
    WidgetTitleComponent,
    AuditLogComponent,
    TicketLinkedListComponent,
  ],
})
export class UserViewComponent {
  LinkedTable = LinkedTable;

  displayStructureView = output<number>();

  sectionDisplayed = input<RightPanelSection>();
  user = input<User>(null);
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

  get sectionStructuresDisplayed() {
    return (
      this.sectionDisplayed() ===
      RightPanelSection.RIGHT_PANEL_SECTION_STRUCTURES
    );
  }

  get sectionHistoricalDisplayed() {
    return (
      this.sectionDisplayed() === RightPanelSection.RIGHT_PANEL_SECTION_HISTORICAL
    );
  }
  
  get sectionTicketsDisplayed() {
    return (
      this.sectionDisplayed() === RightPanelSection.RIGHT_PANEL_SECTION_TICKETS
    );
  }

  constructor(
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}


 
  onEdit(user: User) {
    this.edit.emit(user.id);
  }

  onDelete() {
    this.userService.delete(this.user().id).subscribe(() => this.deleted.emit());
  }

  onArchive(isArchived: boolean) {
    this.confirmationService.confirm({
      message: isArchived
        ? 'Voulez-vous désarchiver cet utilisateur?'
        : 'Voulez-vous archiver cet utilisateur?',
      icon: 'icon-warning',
      header: 'Confirmation',
      dismissableMask: true,
      accept: () => {
        const { roles, structures, ...userWithoutRolesAndStructures } = this.user();
        const data = {
          ...userWithoutRolesAndStructures,
          archivedAt: isArchived ? null : new Date(),
        };
      
        this.userService.update(data, this.user().id)
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succes',
                detail: `L'utilisateur'est ${
                  isArchived ? 'désarchivé' : 'archivé'
                }`,
              });
            },
          });
      },
    });
  }
}

