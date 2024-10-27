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
import { User } from '@app/core/models/user.class';
import { UserService } from '@app/core/services/user.service';
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
import { UserInfoComponent } from '../components/user-info/user-info.component';
import { UserStructuresComponent } from '../components/user-structures/user-structures.component';
import { WidgetTitleComponent } from '../../../shared/common/widget-title/widget-title.component';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ModalConfirmDeleteComponent,
    ButtonModule,
    UserInfoComponent,
    UserStructuresComponent,
    WidgetTitleComponent,
  ],
})
export class UserViewComponent implements OnInit {
  displayStructureView = output<number>();
  sectionDisplayed = input<RightPanelSection>();


  userId = input<number>();
  userId$: Observable<number> = toObservable(this.userId);

  edit = output<number>();
  deleted = output<void>();

  user$: Observable<User>;
  private reloadUser$: BehaviorSubject<void> = new BehaviorSubject<void>(
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
  get sectionStructuresDisplayed() {
    return (
      this.sectionDisplayed() ===
      RightPanelSection.RIGHT_PANEL_SECTION_STRUCTURES
    );
  }

  constructor(
    private destroyRef: DestroyRef,
    private userService: UserService,
    private confirmationService: ConfirmationService
  ) {
    this.userService.entityChanged$ //reload users automatically on crud activity on this service
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.reload();
      });
  }

  ngOnInit() {
    this.loadUser();
  }
  loadUser() {
    this.user$ = this.userId$.pipe(
      startWith(this.userId()),
      distinctUntilChanged(),
      switchMap(() => this.reloadUser$),
      takeUntilDestroyed(this.destroyRef),
      switchMap(() => this.userService.getById(this.userId())),
      shareReplay(),
    );
  }

  reload() {
    this.reloadUser$.next();
  }

  onEdit(user: User) {
    this.edit.emit(user.id);
  }

  onDelete() {
    this.userService.delete(this.userId()).subscribe(() => this.deleted.emit());
  }
  onArchive(isArchived: boolean) {
    this.confirmationService.confirm({
      message: isArchived ? 'Voulez-vous désarchiver cet utilisateur ?' : 'Voulez-vous archiver cet utilisateur?',
      icon: 'icon-warning',
      header:'Confirmation',
      dismissableMask: true,
      accept: () => {
        this.user$.pipe(
          take(1),
          switchMap((user: User) => this.userService.update({
            ...user,
            archive: isArchived ? false : true,
          })),
        ).subscribe(() => {
          this.reload();
        });
      }
    });
  };
}

