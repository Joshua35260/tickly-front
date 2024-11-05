import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { RightPanelSection } from '@app/core/models/enums/right-panel-section.enum';
import { Structure } from '@app/core/models/structure.class';
import { StructureService } from '@app/core/services/structure.service';
import { ModalConfirmDeleteComponent } from '@app/shared/common/modal-confirm-delete/modal-confirm-delete.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { BehaviorSubject, Observable } from 'rxjs';
import { StructureInfoComponent } from '../components/structure-info/structure-info.component';
import { StructureUsersComponent } from '../components/structure-users/structure-users.component';
import { AuditLogComponent } from '@app/shared/audit-log/audit-log.component';
import { LinkedTable } from '@app/core/models/enums/linked-table.enum';
import { TicketLinkedListComponent } from '@app/shared/ticket-linked-list/ticket-linked-list.component';

@Component({
  selector: 'app-structure-view',
  templateUrl: './structure-view.component.html',
  styleUrls: ['./structure-view.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ModalConfirmDeleteComponent,
    ButtonModule,
    StructureInfoComponent,
    StructureUsersComponent,
    AuditLogComponent,
    TicketLinkedListComponent,
  ],
})
export class StructureViewComponent {
  LinkedTable = LinkedTable;
  sectionDisplayed = input<RightPanelSection>();

  structure = input<Structure>();

  edit = output<number>();
  deleted = output<void>();

  structure$: Observable<Structure>;
  private reloadStructure$: BehaviorSubject<void> = new BehaviorSubject<void>(
    void 0
  );

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
      this.sectionDisplayed() ===
      RightPanelSection.RIGHT_PANEL_SECTION_HISTORICAL
    );
  }
  get sectionTicketsDisplayed() {
    return (
      this.sectionDisplayed() === RightPanelSection.RIGHT_PANEL_SECTION_TICKETS
    );
  }

  constructor(
    private structureService: StructureService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  reload() {
    this.reloadStructure$.next();
  }

  onEdit() {
    this.edit.emit(this.structure().id);
  }

  onDelete() {
    this.structureService
      .delete(this.structure().id)
      .subscribe(() => this.deleted.emit());
  }

  onArchive(isArchived: boolean) {
    this.confirmationService.confirm({
      message: isArchived
        ? 'Voulez-vous désarchiver cette structure?'
        : 'Voulez-vous archiver cette structure?',
      icon: 'icon-warning',
      header: 'Confirmation',
      dismissableMask: true,
      accept: () => {
        this.structureService
          .update(
            {
              archivedAt: isArchived ? null : new Date(), // Met à jour en fonction de isArchived
            },
            this.structure().id
          )
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succes',
                detail: `La structure est ${
                  isArchived ? 'désarchivé' : 'archivée'
                }`,
              });
            },
          });
      },
    });
  }
}
