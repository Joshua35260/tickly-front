import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { RightPanelSection } from '@app/core/models/enums/right-panel-section.enum';
import { Ticket } from '@app/core/models/ticket.class';
import { TicketService } from '@app/core/services/ticket.service';
import { ModalConfirmDeleteComponent } from '@app/shared/common/modal-confirm-delete/modal-confirm-delete.component';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import {
  BehaviorSubject,
  distinctUntilChanged,
  Observable,
  shareReplay,
  switchMap,
} from 'rxjs';
import { startWith, take } from 'rxjs/operators';
import { TicketInfoComponent } from '../components/ticket-info/ticket-info.component';

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
  ],
})
export class TicketViewComponent implements OnInit {
  sectionDisplayed = input<RightPanelSection>();
  ticketId = input<number>();

  ticketId$: Observable<number> = toObservable(this.ticketId);

  edit = output<number>();
  deleted = output<void>();

  ticket$: Observable<Ticket>;
  private reloadTicket$: BehaviorSubject<void> = new BehaviorSubject<void>(
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

  constructor(
    private destroyRef: DestroyRef,
    private ticketService: TicketService,
    private confirmationService: ConfirmationService
  ) {
    this.ticketService.entityChanged$ //reload users automatically on crud activity on this service
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loadTicket();
      });
  }

  ngOnInit() {
    this.loadTicket();
  }

  loadTicket() {
    this.ticket$ = this.ticketId$.pipe(
      startWith(this.ticketId()),
      distinctUntilChanged(),
      switchMap(() => this.reloadTicket$),
      takeUntilDestroyed(this.destroyRef),
      switchMap(() => this.ticketService.getById(this.ticketId())),
      shareReplay()
    );
  }

  reload() {
    this.reloadTicket$.next();
  }

  onEdit() {
    this.edit.emit(this.ticketId());
  }

  onDelete() {
    this.ticketService
      .delete(this.ticketId())
      .subscribe(() => this.deleted.emit());
  }

  onArchive(isArchived: boolean) {
    this.confirmationService.confirm({
      message: isArchived
        ? 'Voulez-vous désarchiver ce contact?'
        : 'Voulez-vous archiver ce contact?',
      icon: 'icon-warning',
      header: 'Confirmation',
      dismissableMask: true,
      accept: () => {
        this.ticket$
          .pipe(
            take(1),
            switchMap((ticket: Ticket) =>
              this.ticketService.update({
                ...ticket,
                archive: isArchived ? false : true,
              })
            )
          )
          .subscribe(() => {
            this.reload();
          });
      },
    });
  }
}
