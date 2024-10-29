import { Category } from './../../../../core/models/category.class';
import { TicketService } from '@app/core/services/ticket.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputComponent } from '@app/shared/common/input/input.component';
import { TextAreaComponent } from '@app/shared/common/text-area/text-area.component';
import { WidgetTitleComponent } from '@app/shared/common/widget-title/widget-title.component';
import { WidgetComponent } from '@app/shared/common/widget/widget.component';
import { ButtonModule } from 'primeng/button';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { distinct, distinctUntilChanged, filter, startWith, switchMap, take } from 'rxjs';
import { Priority } from '@app/core/models/priority.class';
import { PriorityDropdownLabels } from '@app/core/models/enums/priority.enum';
import { Status } from '@app/core/models/status.class';
import { StatusDropdownLabels } from '@app/core/models/enums/status.enum';
import { CategoryDropdownLabels } from '@app/core/models/enums/category.enum';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';

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

saved = output<void>();
ticketForm: FormGroup;
priorityOption = PriorityDropdownLabels;
statusOption = StatusDropdownLabels;
categoryOption = CategoryDropdownLabels;
  constructor(
    private router: Router,
    private ticketService : TicketService,
    private destroyRef: DestroyRef,
  ) {
    this.ticketForm = new FormGroup({
      title: new FormControl(''),
      description: new FormControl(''),
      priority: new FormControl(''),
      category: new FormControl([]),
      status: new FormControl(''),
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
    });
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
  }
  onSubmit() {

    if (this.ticketForm.valid) {
      const ticketData = {...this.ticketForm.value};
      if (this.ticketId()) {
        this.ticketService
          .update(ticketData, this.ticketId())
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => this.saved.emit(),
            error: (error) => console.error('Ticket update failed', error),
          });
      } else {
        this.ticketService
          .create(ticketData)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => this.saved.emit(),
            error: (error) => console.error('Ticket registration failed', error),
          });
      }
    }
  }
  onCancel() {
    this.ticketForm.reset();
    this.router.navigate([{ outlets: { modal: null } }], { queryParamsHandling: 'preserve' });
  }
}
