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
  ]
})
export class UserViewComponent implements OnInit {

  sectionDisplayed = input<RightPanelSection>();
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
      startWith(this.userId),
      distinctUntilChanged(),
      switchMap(() => this.reloadUser$),
      takeUntilDestroyed(this.destroyRef),
      switchMap(() => this.userService.getUser(this.userId())),
      shareReplay(),
    );
  }

  reload() {
    this.reloadUser$.next();
  }

  onEdit() {
    this.edit.emit(this.userId());
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
