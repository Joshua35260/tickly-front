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
import { User } from '@app/core/models/user.class';
import { InputComponent } from '@app/shared/common/input/input.component';
import { WidgetTitleComponent } from '@app/shared/common/widget-title/widget-title.component';
import { WidgetComponent } from '@app/shared/common/widget/widget.component';
import { MenuItem } from 'primeng/api';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { merge, Observable, startWith, take } from 'rxjs';
import { UserService } from '@app/core/services/user.service';
import { UserRowComponent } from '@app/features/user/components/user-row/user-row.component';
import { RightPanelSection } from '@app/core/models/enums/right-panel-section.enum';
import { Structure } from '@app/core/models/structure.class';
import { StructureService } from '@app/core/services/structure.service';
interface SortOption {
  label: string;
  filter: string;
}
@Component({
  selector: 'app-structure-users',
  templateUrl: './structure-users.component.html',
  styleUrls: ['./structure-users.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    WidgetComponent,
    InputComponent,
    WidgetTitleComponent,
    UserRowComponent,
    InputSwitchModule,
    ReactiveFormsModule,
    DropdownModule,
    AutoCompleteModule,
    ButtonModule,
  ],
})
export class StructureUsersComponent implements OnInit {
  listUpdated = output<void>();
  displayStructureView = output<number>();
  structure = input.required<Structure>();
  private structure$: Observable<Structure> = toObservable(this.structure);

  entityIdFromMenu?: number;
  menuItems: MenuItem[];

  filteredUsers = signal<User[]>([]);
  usersAttachedToStructure = signal<any[]>([]);

  subFormOpened: boolean = false;

  sortOptions: SortOption[] = [
    { label: 'Nom (asc)', filter: 'lastname asc' },
    { label: 'Nom (desc)', filter: 'lastname desc' },
    { label: 'Prenom (asc)', filter: 'firstname asc' },
    { label: 'Prenom (desc)', filter: 'firstname desc' },
  ];

  selectedOption = signal<SortOption>(this.sortOptions[0]);

  userAttachedForm: FormGroup;
  newUserForm: FormGroup;

  filteredAndSortedUsers = computed(() => {
    const searchTerm = this.userAttachedForm?.get('user').value || '';
    
    // Filtrage des utilisateurs par prénom ou nom
    const filtered = this.usersAttachedToStructure()?.filter((data) =>
      data.firstname.toLowerCase().includes(searchTerm.toLowerCase()) || 
      data.lastname.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    // Tri en fonction de l'option sélectionnée
    return filtered.sort((a, b) => {
      // Normalisation des champs pour comparaison
      const firstnameA = a.firstname ? a.firstname.toLowerCase() : '';
      const firstnameB = b.firstname ? b.firstname.toLowerCase() : '';
      const lastnameA = a.lastname ? a.lastname.toLowerCase() : '';
      const lastnameB = b.lastname ? b.lastname.toLowerCase() : '';
  
      switch (this.selectedOption().filter) {
        case 'firstname asc':
          return firstnameA.localeCompare(firstnameB);
        case 'firstname desc':
          return firstnameB.localeCompare(firstnameA);
        case 'lastname asc':
          return lastnameA.localeCompare(lastnameB);
        case 'lastname desc':
          return lastnameB.localeCompare(lastnameA);
        default:
          return 0;
      }
    });
  });
  
  constructor(
    private destroyRef: DestroyRef,
    private structureService: StructureService,
    private userService: UserService,
    private router: Router
  ) {
    this.menuItems = [
      {
        label: 'Détacher',
        icon: 'icon-trashcan',
        command: () => this.deleteAttachment(),
      },
    ];
  }

  ngOnInit() {
    this.structure$
      .pipe(startWith(this.structure()), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loadUsers();
      });

    this.initUserAttachedForm();
    this.initNewUserForm();
  }

  loadUsers() {
    this.searchUsers();
  }

  initUserAttachedForm() {
    this.userAttachedForm = new FormGroup({
      user: new FormControl(null),
      checked: new FormControl(false),
    });
    merge(
      this.userAttachedForm.get('user').valueChanges,
      this.userAttachedForm.get('checked').valueChanges
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.searchUsers());
  }


  searchUsers() {
    const searchTerm = this.userAttachedForm?.get('user').value || '';
    if (searchTerm) {
      this.usersAttachedToStructure.set(
        this.structure().users.filter((data) =>
          data.firstname.toLowerCase().includes(searchTerm.toLowerCase()) || data.lastname.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      this.usersAttachedToStructure.set(this.structure().users);
    }
  }

  onSortChanged(option: SortOption) {
    this.selectedOption.set(option);
  }

  initNewUserForm() {
    this.newUserForm = new FormGroup({
      selectedNewUser: new FormControl(null, Validators.required),
    });
  }
  filterNewUser(event: AutoCompleteCompleteEvent) {
    const query = event.query || '';
    this.userService
      .getAutocompleteUserByName(query.length >= 2 ? query : '')
      .subscribe((data: PaginatedData<User>) => {
        // Ajout de la propriété fullName dans chaque utilisateur
        const usersWithFullName = data.items.map(user => ({
          ...user,
          fullName: `${user.firstname} ${user.lastname}`,
        }));
  
        // Mise à jour de `filteredUsers` avec `set` pour inclure fullName
        this.filteredUsers.set(usersWithFullName);
  
        // Patch pour garder la valeur de recherche
        this.newUserForm.patchValue({
          selectedNewUser: query || '',
        });
      });
  }
  
  setEntityIdFromMenu(id: number) {
    this.entityIdFromMenu = id;
  }
  onAttach() {
    const selectedUserId =
      this.newUserForm.value.selectedNewUser.id;
    this.structureService
      .addUserToStructure(selectedUserId, this.structure().id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.listUpdated.emit();
        this.userAttachedForm.reset();
        this.newUserForm.reset();
        this.subFormOpened = false;
      });
  }
  deleteAttachment() {

    this.structureService
      .deleteUserFromStructure(this.entityIdFromMenu, this.structure().id)
      .pipe(take(1))
      .subscribe(() => {
        this.listUpdated.emit();
      });
  }

  openChange(opened: boolean) {
    this.subFormOpened = opened;
  }

  openAddUser() {
    this.router.navigate([{ outlets: { modal: ['user', 'create'] } }], {
      queryParamsHandling: 'merge',
      queryParams: { doNotOpenAfterCreate: true },
    });
  }
  displayUserView(userId: number) {
    this.router.navigate([{ outlets: { panel: [ 'user', 'view', userId, RightPanelSection.RIGHT_PANEL_SECTION_INFO ] } }], { queryParamsHandling: 'preserve' });
  }
}
