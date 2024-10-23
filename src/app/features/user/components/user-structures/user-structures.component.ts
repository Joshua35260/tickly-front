import { PaginatedData } from '@app/core/models/paginated-data.class';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RightPanelSection } from '@app/core/models/enums/right-panel-section.enum';
import { Structure } from '@app/core/models/structure.class';
import { User } from '@app/core/models/user.class';
import { StructureService } from '@app/core/services/structure.service';
import { StructureRowComponent } from '@app/features/structure/components/structure-row/structure-row.component';
import { InputComponent } from '@app/shared/common/input/input.component';
import { WidgetTitleComponent } from '@app/shared/common/widget-title/widget-title.component';
import { WidgetComponent } from '@app/shared/common/widget/widget.component';
import { MenuItem } from 'primeng/api';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { merge, Observable, startWith, take } from 'rxjs';
interface SortOption {
  label: string;
  filter: string;
}
@Component({
  selector: 'app-user-structures',
  templateUrl: './user-structures.component.html',
  styleUrls: ['./user-structures.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    WidgetComponent,
    InputComponent,
    WidgetTitleComponent,
    StructureRowComponent,
    InputSwitchModule,
    ReactiveFormsModule,
    DropdownModule,
    AutoCompleteModule,
    ButtonModule,
  ],
})
export class UserStructuresComponent implements OnInit {
  listUpdated = output<void>();
  displayStructureView = output<number>();
  user = input.required<User>();
  private user$: Observable<User> = toObservable(this.user);

  rowId?: number;
  menuItems: MenuItem[] | undefined;

  filteredStructures = signal<Structure[]>([]);
  structureAttachedToSite = signal<any[]>([]);

  subFormOpened: boolean = false;

  sortOptions: SortOption[] = [
    { label: 'Nom (asc)', filter: 'name asc' },
    { label: 'Nom (desc)', filter: 'name desc' },
  ];

  selectedOption = signal<SortOption>(this.sortOptions[0]);

  structureAttachedForm: FormGroup;
  newStructureForm: FormGroup;

  filteredAndSortedStructures = computed(() => {
    const searchTerm = this.structureAttachedForm?.get('structure').value || '';
    const filtered = this.structureAttachedToSite()?.filter((data) =>
      data.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
  
    // Tri en fonction de l'option sélectionnée
    return filtered.sort((a, b) => {
      const nameA = a.name ? a.name.toLowerCase() : '';  // Normalisation des noms pour comparaison
      const nameB = b.name ? b.name.toLowerCase() : '';
  
      switch (this.selectedOption().filter) {
        case 'name asc':
          return nameA.localeCompare(nameB);
        case 'name desc':
          return nameB.localeCompare(nameA);
        default:
          return 0;
      }
    });
  });
  
  constructor(
    private destroyRef: DestroyRef,
    private structureService: StructureService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user$
      .pipe(startWith(this.user()), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loadStructuresAttachedToUser();
      });

    this.initStructureAttachedForm();
    this.initNewStructureForm();
    console.log(this.user().structures);
  }

  loadStructuresAttachedToUser() {
    this.searchStructures();
  }

  initStructureAttachedForm() {
    this.structureAttachedForm = new FormGroup({
      structure: new FormControl(null),
      checked: new FormControl(false),
    });
    merge(
      this.structureAttachedForm.get('structure').valueChanges,
      this.structureAttachedForm.get('checked').valueChanges
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.searchStructures());
  }

  searchStructures() {
    const searchTerm = this.structureAttachedForm?.get('structure').value || '';
    if (searchTerm) {
      this.structureAttachedToSite.set(
        this.user().structures.filter((data) =>
          data.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      this.structureAttachedToSite.set(this.user().structures);
    }
  }

  onSortChanged(event) {
    this.selectedOption.set(event.value);
    console.log(this.selectedOption());
  }
  initNewStructureForm() {
    this.newStructureForm = new FormGroup({
      selectedNewStructure: new FormControl(null, Validators.required),
    });
  }

  filterNewStructure(event: AutoCompleteCompleteEvent) {
    const query = event.query || '';
    this.structureService
      .getAutocompleteStructureByName(query.length >= 2 ? query : '')
      .subscribe((data: PaginatedData<Structure>) => {
        this.filteredStructures.set(data.items);
        this.newStructureForm.patchValue({
          selectedNewStructure: query || '',
        });
      });
  }
  setRowId(id: number) {
    this.rowId = id;
  }
  onAttach() {
    const selectedStructureId =
      this.newStructureForm.value.selectedNewStructure.id;
    this.structureService
      .addStructureToUser(this.user().id, selectedStructureId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.listUpdated.emit();
        this.structureAttachedForm.reset();
        this.newStructureForm.reset();
        this.subFormOpened = false;
      });
  }
  onDelete(id: number) {
    this.structureService
      .deleteStructureFromUser(this.user().id, id)
      .pipe(take(1))
      .subscribe(() => {
        this.listUpdated.emit();
      });
  }

  openChange(opened: boolean) {
    this.subFormOpened = opened;
  }

  openAddStructure() {
    this.router.navigate([{ outlets: { modal: ['structure', 'create'] } }], {
      queryParamsHandling: 'preserve',
      queryParams: { doNotOpenAfterCreate: true },
    });
  }
}
