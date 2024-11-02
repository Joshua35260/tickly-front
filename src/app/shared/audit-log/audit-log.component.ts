import { StructureService } from './../../core/services/structure.service';
import { UserService } from './../../core/services/user.service';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { WidgetComponent } from '../common/widget/widget.component';
import { CommonModule } from '@angular/common';
import { WidgetTitleComponent } from '../common/widget-title/widget-title.component';
import { AvatarComponent } from '../common/avatar/avatar.component';
import { EmptyListComponent } from '../common/layout/empty-list/empty-list.component';
import { LinkedTable } from '@app/core/models/enums/linked-table.enum';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { AuditLog } from '@app/core/models/audit-log.class';
import { AuditLogService } from '@app/core/services/audit-log.service';
import { TicketService } from '@app/core/services/ticket.service';

@Component({
  selector: 'app-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    WidgetComponent,
    WidgetTitleComponent,
    AvatarComponent,
    EmptyListComponent,
  ],
})
export class AuditLogComponent implements OnInit {
  linkedTable = input<LinkedTable>();
  linkedId = input<number>();

  auditlogs = signal<AuditLog[]>([]);

  widgetTitleSubtitle = input<string>('');
  widgetTitleTitle = input<string>('');
  constructor(
    private destroyRef: DestroyRef,
    private auditLogService: AuditLogService,
    private ticketService: TicketService,
    private UserService: UserService,
    private structureService : StructureService
  ) {
    this.ticketService.entityChanged$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.getLogs(this.linkedTable(), this.linkedId());
      })

    this.UserService.entityChanged$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.getLogs(this.linkedTable(), this.linkedId());
      })

    this.structureService.entityChanged$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.getLogs(this.linkedTable(), this.linkedId());
      })
  }

  ngOnInit() {
    if (this.linkedTable() && this.linkedId()) {
      this.getLogs(this.linkedTable(), this.linkedId());
    }
  }

  getLogs(linkedTable: LinkedTable, linkedId: number) {
    this.auditLogService
      .getAuditLogsByEntity(linkedTable, linkedId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((auditlogs: AuditLog[]) => {
        this.auditlogs.set(auditlogs);
      });
  }

  formatValue(value: string | null) {
    if (!value || value === 'null') {
      return 'null'; // Retourner 'null' si la valeur est vide ou 'null'
    }

    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.toLocaleString('fr-FR', { 
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    }

    // Si ce n'est pas une date, retourner la valeur par défaut
    return value;
  }
  

}
