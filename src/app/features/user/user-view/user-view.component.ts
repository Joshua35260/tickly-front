import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, input, output, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { RightPanelSection } from '@app/core/models/enums/right-panel-section.enum';
import { User } from '@app/core/models/user.class';
import { UserService } from '@app/core/services/user.service';
import { ModalConfirmDeleteComponent } from '@app/shared/common/modal-confirm-delete/modal-confirm-delete.component';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { BehaviorSubject, distinctUntilChanged, Observable, shareReplay, switchMap } from 'rxjs';
import { startWith, take } from 'rxjs/operators';
import { UserInfoComponent } from '../components/user-info/user-info.component';
import { jobType } from '@app/core/models/enums/job-type.enum';
import { UserStructuresComponent } from '../components/user-structures/user-structures.component';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: [ './user-view.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ModalConfirmDeleteComponent,
    ButtonModule,
    UserInfoComponent,
    UserStructuresComponent,
  ]
})
export class UserViewComponent implements OnInit {
  displayStructureView = output<number>();
  sectionDisplayed = input<RightPanelSection>();
  jobTypeOutputOnLoad = output<jobType>();

  userId = input<number>();
  userId$: Observable<number> = toObservable(this.userId);

  edit = output<number>();
  deleted = output<void>();

  user$: Observable<User>;
  private reloadUser$: BehaviorSubject<void> = new BehaviorSubject<void>(void 0);

  showDeleteModal = signal<boolean>(false);

  get sectionInfoDisplayed() {
    return this.sectionDisplayed() === RightPanelSection.RIGHT_PANEL_SECTION_INFO;
  }

  get sectionActionsDisplayed() {
    return this.sectionDisplayed() === RightPanelSection.RIGHT_PANEL_SECTION_ACTIONS;
  }
  get sectionStructuresDisplayed() {
    return this.sectionDisplayed() === RightPanelSection.RIGHT_PANEL_SECTION_STRUCTURES;
  }

  constructor(
    private destroyRef: DestroyRef,
    private userService: UserService,
    private confirmationService: ConfirmationService,
  ) {
    }

  ngOnInit() {
    this.loadUser();    
  }
  loadUser() {
    this.user$ = this.userId$.pipe(
      startWith(this.userId()), // Utiliser la valeur initiale de userId
      distinctUntilChanged(),
      switchMap(() => this.reloadUser$), // Utiliser la BehaviorSubject pour déclencher le rechargement
      takeUntilDestroyed(this.destroyRef),
      switchMap(() => this.userService.getUser(this.userId())),
      switchMap(user => {
        // Émettre le jobType après le chargement de l'utilisateur
        this.jobTypeOutputOnLoad.emit(user.jobTypeId);
        return [user]; // Transformer la réponse en tableau pour que shareReplay fonctionne
      }),
      shareReplay(1), // Partager la dernière valeur
    );
  }

  reload() {
    this.reloadUser$.next();
  }

  onEdit(user:User) {
    this.edit.emit(user.id);
  }

  onDelete() {
        this.userService.deleteUser(this.userId()).subscribe(() => this.deleted.emit());
  }

  // onArchive(isArchived: boolean) {
  //   this.confirmationService.confirm({
  //     message: isArchived ? 'Voulez-vous désarchiver ce contact?' : 'Voulez-vous archiver ce contact?',
  //     icon: 'icon-warning',
  //     header:'Confirmation',
  //     dismissableMask: true,
  //     accept: () => {
  //       this.user$.pipe(
  //         take(1),
  //         switchMap((user: User) => this.userService.updateUser(new User({
  //           ...user,
  //           archive: isArchived ? false : true,
  //         }))),
  //       ).subscribe(() => {
  //         this.reload();
  //       });
  //     }
  //   });
  // };
}
