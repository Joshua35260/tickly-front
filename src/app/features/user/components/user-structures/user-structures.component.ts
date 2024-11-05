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
import { Structure } from '@app/core/models/structure.class';
import { User } from '@app/core/models/user.class';
import { StructureService } from '@app/core/services/structure.service';
import { StructureRowComponent } from '@app/features/structure/components/structure-row/structure-row.component';
import { InputComponent } from '@app/shared/common/input/input.component';
import { WidgetTitleComponent } from '@app/shared/common/widget-title/widget-title.component';
import { WidgetComponent } from '@app/shared/common/widget/widget.component';
import { MenuItem } from 'primeng/api';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import {  Observable, startWith, take } from 'rxjs';
import { UserService } from '@app/core/services/user.service';
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

  entityIdFromMenu?: number;
  menuItems: MenuItem[];

  filteredStructures = signal<Structure[]>([]);
  structureAttachedToUser = signal<any[]>([]);

  subFormOpened: boolean = false;

  sortOptions: SortOption[] = [
    { label: 'Nom (asc)', filter: 'name asc' },
    { label: 'Nom (desc)', filter: 'name desc' },
  ];

  selectedOption = signal<SortOption>(this.sortOptions[0]);

  structureAttachedForm: FormGroup;
  newStructureForm: FormGroup;
  showArchived = signal<boolean>(false);

  filteredAndSortedStructures = computed(() => {
    const searchTerm = this.structureAttachedForm?.get('structure').value || '';
    const filtered =
      this.structureAttachedToUser()?.filter((data) => {
        const matchesSearchTerm = data.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesArchived = this.showArchived()
          ? data.archivedAt === null
          : true;
        return matchesSearchTerm && matchesArchived;
      }) || [];

    // Tri en fonction de l'option sélectionnée
    return filtered.sort((a, b) => {
      const nameA = a.name ? a.name.toLowerCase() : '';
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
    private userService: UserService,
    private structureService: StructureService,
    private router: Router
  ) {
    this.menuItems = [
      {
        label: 'Détacher',
        icon: 'icon-trashcan',
        command: () => this.deleteAttachment(),
      },
    ];
    this.structureService.activeEntity$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((entity: Structure) => {
      // Vérifiez que l'entité n'est pas undefined ou null
      if (entity) {
        // Assurez-vous que 'selectedNewStructure' existe dans le formulaire
        if (this.newStructureForm.get('selectedNewStructure')) {
          this.newStructureForm.get('selectedNewStructure').setValue(entity);
        }
  
        // Mettre à jour les structures filtrées
        this.filteredStructures.set([entity]);
      }
    });
  
  }

  ngOnInit() {
    this.user$
      .pipe(startWith(this.user()), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loadStructuresAttachedToUser();
      });

    this.initStructureAttachedForm();
    this.initNewStructureForm();
  }

  loadStructuresAttachedToUser() {
    this.searchStructures();
  }

  initStructureAttachedForm() {
    this.structureAttachedForm = new FormGroup({
      structure: new FormControl(null),
      checked: new FormControl(false),
    });

    this.structureAttachedForm
      .get('structure')
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.searchStructures());

    // Écoute des changements de valeur sur le champ 'checked'
    this.structureAttachedForm
      .get('checked')
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.showArchived.set(value)); // Utiliser value directement
  }

  searchStructures() {
    const searchTerm = this.structureAttachedForm?.get('structure').value || '';
    if (searchTerm) {
      this.structureAttachedToUser.set(
        this.user().structures.filter((data) =>
          data.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      this.structureAttachedToUser.set(this.user().structures);
    }
  }

  onSortChanged(event) {
    this.selectedOption.set(event.value);
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
  setEntityIdFromMenu(id: number) {
    this.entityIdFromMenu = id;
  }
  onAttach() {
    const selectedStructureId =
      this.newStructureForm.value.selectedNewStructure.id;
    this.userService
      .addStructureToUser(this.user().id, selectedStructureId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.listUpdated.emit();
        this.structureAttachedForm.reset();
        this.newStructureForm.reset();
        this.subFormOpened = false;
      });
  }
  deleteAttachment() {
    this.userService
      .deleteStructureFromUser(this.user().id, this.entityIdFromMenu)
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
      queryParamsHandling: 'merge',
      queryParams: { doNotOpenAfterCreate: true },
    });
  }
}
