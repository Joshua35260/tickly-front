import { TicketService } from '@app/core/services/ticket.service';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { WidgetComponent } from '../common/widget/widget.component';
import { WidgetTitleComponent } from '../common/widget-title/widget-title.component';
import { TicketRowComponent } from '@app/features/ticket/components/ticket-row/ticket-row.component';
import { LinkedTable } from '@app/core/models/enums/linked-table.enum';
import { Ticket } from '@app/core/models/ticket.class';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { RightPanelSection } from '@app/core/models/enums/right-panel-section.enum';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputComponent } from '../common/input/input.component';
interface SortOption {
  label: string;
  filter: string;
}
@Component({
  selector: 'app-ticket-linked-list',
  templateUrl: './ticket-linked-list.component.html',
  styleUrls: ['./ticket-linked-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    WidgetComponent,
    WidgetTitleComponent,
    TicketRowComponent,
    ReactiveFormsModule,
    DropdownModule,
    InputSwitchModule,
    InputComponent,
  ],
})
export class TicketLinkedListComponent implements OnInit {
  fromEntity = input<LinkedTable>(null);
  fromEntity$ = toObservable(this.fromEntity);
  entityId = input<number>();
  tickets = signal<Ticket[]>([]);
  title = signal<string>(null);
  searchForm: FormGroup;
  showArchived = signal<boolean>(false);

  sortOptions: SortOption[] = [
    { label: 'Numéro (asc)', filter: 'id asc' },
    { label: 'Numéro (desc)', filter: 'id desc' },
    { label: 'Nom (asc)', filter: 'name asc' },
    { label: 'Nom (desc)', filter: 'name desc' },
  ];

  selectedOption = signal<SortOption>(this.sortOptions[0]);
  searchTerm = signal<string>('');
  filteredAndSortedTickets = computed(() => {
    const searchTerm = this.searchTerm() || ''; // Utilisez le signal searchTerm

    const filtered = this.tickets().filter((data) => {
      const matchesSearchTerm =
        (data.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (data.author?.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (data.author?.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (data.structure?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
        
      const matchesArchived = this.showArchived() ? data.archivedAt === null : true;
      return matchesSearchTerm && matchesArchived;
    }) || [];

    // Tri en fonction de l'option sélectionnée
    return filtered.sort((a, b) => {
      switch (this.selectedOption().filter) {
        case 'id asc':
          return a.id - b.id;
        case 'id desc':
          return b.id - a.id;
        case 'name asc':
          return (a.author?.firstname || '').localeCompare(b.author?.firstname || '');
        case 'name desc':
          return (b.author?.lastname || '').localeCompare(a.author?.lastname || '');
        default:
          return 0; // Aucune modification si aucun cas ne correspond
      }
    });
  });

  constructor(
    private ticketService: TicketService,
    private router: Router,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    if (this.fromEntity()) {
      this.loadTicketsByEntity(this.fromEntity());
      this.initTicketsAttachedForm();
    }
  }
  onSortChanged(event) {
    this.selectedOption.set(event.value);
  }

 

  initTicketsAttachedForm() {
    this.searchForm = new FormGroup({
      ticket: new FormControl(null),
      checked: new FormControl(false),
    });

    this.searchForm
      .get('ticket')
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.searchTerm.set(value));

    this.searchForm
      .get('checked')
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.showArchived.set(value));
  }

  loadTicketsByEntity(entity: LinkedTable) {
    switch (entity) {
      case LinkedTable.USER:
        this.title.set("Tickets liés à l'utilisateur");
        this.ticketService
          .getTicketByUserId(this.entityId())
          .subscribe((tickets) => {
            this.tickets.set(tickets);
          });
        break;

      case LinkedTable.STRUCTURE:
        this.title.set('Tickets liés à la structure');
        this.ticketService
          .getTicketByStructureId(this.entityId())
          .subscribe((tickets) => {
            this.tickets.set(tickets);
          });
        break;

      default:
        this.title.set(null);
        console.warn('Entity type not recognized');
    }
  }

  displayTicketView(ticketId: number) {
    if (ticketId) {
      this.router.navigate(
        [
          {
            outlets: {
              panel: [
                'ticket',
                'view',
                ticketId,
                RightPanelSection.RIGHT_PANEL_SECTION_INFO,
              ],
            },
          },
        ],
        { queryParamsHandling: 'preserve' }
      );
    }
  }
}
