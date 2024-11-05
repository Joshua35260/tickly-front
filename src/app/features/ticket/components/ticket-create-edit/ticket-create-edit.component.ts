import { StructureService } from '@app/core/services/structure.service';
import { TicketService } from '@app/core/services/ticket.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, input, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputComponent } from '@app/shared/common/input/input.component';
import { TextAreaComponent } from '@app/shared/common/text-area/text-area.component';
import { WidgetTitleComponent } from '@app/shared/common/widget-title/widget-title.component';
import { WidgetComponent } from '@app/shared/common/widget/widget.component';
import { ButtonModule } from 'primeng/button';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { distinct, distinctUntilChanged, filter, startWith} from 'rxjs';
import { PriorityDropdownLabels } from '@app/core/models/enums/priority.enum';
import { StatusDropdownLabels } from '@app/core/models/enums/status.enum';
import { CategoryDropdownLabels } from '@app/core/models/enums/category.enum';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { Structure } from '@app/core/models/structure.class';
import { Ticket } from '@app/core/models/ticket.class';

@Component({
  selector: 'app-ticket-create-edit',
  templateUrl: './ticket-create-edit.component.html',
  styleUrls: ['./ticket-create-edit.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    WidgetTitleComponent,
    WidgetComponent,
    ReactiveFormsModule,
    InputComponent,
    TextAreaComponent,
    ButtonModule,
    DropdownModule,
    MultiSelectModule,
  ]
})
export class TicketCreateEditComponent implements OnInit {
ticketId = input<number>();
ticketId$ = toObservable(this.ticketId);

saved = output<number>();
ticketForm: FormGroup;
priorityOption = PriorityDropdownLabels;
statusOption = StatusDropdownLabels;
categoryOption = CategoryDropdownLabels;
structureOption = signal<Structure[]>([]);
  constructor(
    private router: Router,
    private ticketService : TicketService,
    private destroyRef: DestroyRef,
    private structureService: StructureService
  ) {
    this.ticketForm = new FormGroup({
      title: new FormControl(null),
      description: new FormControl(null, [Validators.required]),
      priority: new FormControl(null, [Validators.required]),
      category: new FormControl([], [Validators.required]),
      status: new FormControl({ value: '', disabled: this.isCreating() }),
      structureId: new FormControl(null),
    });
    this.ticketId$
    .pipe(
      startWith(this.ticketId()), // Initialize with the current ticket ID
      distinctUntilChanged(), // Only proceed when ticket ID changes
      filter((ticketId: number) => !!ticketId), // Filter out null or undefined ticket IDs
      takeUntilDestroyed(this.destroyRef) // Destroy the observable when the component is destroyed
    )
    .subscribe((ticketId) => {

      this.loadTicket(ticketId);
      this.ticketForm.get('status')?.enable();
      this.ticketForm.updateValueAndValidity();
    });
}
isCreating(): boolean {
  return !this.ticketId();
}
loadTicket(ticketId: number) {
  this.ticketService
    .getById(ticketId)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((ticket) => {
      this.ticketForm.patchValue(ticket);
    });
}
  ngOnInit() {
    this.structureService.getStructureByUser(1)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((structures: Structure[]) => {
      this.structureOption.set(structures);
    })
  }

  
  onSubmit() {
    if (this.ticketForm.valid) {
      const ticketData = { ...this.ticketForm.value };
      if (this.ticketId()) {
        this.ticketService
          .update(ticketData, this.ticketId())
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (updatedTicket: Ticket) => {
              this.saved.emit(updatedTicket.id); // Emit the ID of the updated ticket
            },
          });
      } else {
        this.ticketService
          .create(ticketData)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (createdTicket: Ticket) => {
              this.saved.emit(createdTicket.id); // Emit the ID of the created ticket
            },
          });
      }
    }
  }
  
  onCancel() {
    this.ticketForm.reset();
    this.router.navigate([{ outlets: { modal: null } }], { queryParamsHandling: 'preserve' });
  }
}
