import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, input, output, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { RightPanelSection } from '@app/core/models/enums/right-panel-section.enum';
import { Structure } from '@app/core/models/structure.class';
import { StructureService } from '@app/core/services/structure.service';
import { ModalConfirmDeleteComponent } from '@app/shared/common/modal-confirm-delete/modal-confirm-delete.component';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { BehaviorSubject, distinctUntilChanged, Observable, shareReplay, switchMap } from 'rxjs';
import { startWith, take } from 'rxjs/operators';
import { StructureInfoComponent } from '../components/structure-info/structure-info.component';


@Component({
  selector: 'app-structure-view',
  templateUrl: './structure-view.component.html',
  styleUrls: [ './structure-view.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ModalConfirmDeleteComponent,
    ButtonModule,
    StructureInfoComponent,
  ]
})
export class StructureViewComponent implements OnInit {

  sectionDisplayed = input<RightPanelSection>();
  structureId = input<number>();

  structureId$: Observable<number> = toObservable(this.structureId);

  edit = output<number>();
  deleted = output<void>();

  structure$: Observable<Structure>;
  private reloadStructure$: BehaviorSubject<void> = new BehaviorSubject<void>(void 0);

  showDeleteModal = signal<boolean>(false);

  get sectionInfoDisplayed() {
    return this.sectionDisplayed() === RightPanelSection.RIGHT_PANEL_SECTION_INFO;
  }

  get sectionActionsDisplayed() {
    return this.sectionDisplayed() === RightPanelSection.RIGHT_PANEL_SECTION_ACTIONS;
  }

  constructor(
    private destroyRef: DestroyRef,
    private structureService: StructureService,
    private confirmationService: ConfirmationService,
  ) {
    this.structureService.entityChanged$ //reload users automatically on crud activity on this service
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {
      this.loadStructure();
    })
    }

  ngOnInit() {
    this.loadStructure();
  }


  loadStructure() {
    this.structure$ = this.structureId$.pipe(
      startWith(this.structureId()),
      distinctUntilChanged(),
      switchMap(() => this.reloadStructure$),
      takeUntilDestroyed(this.destroyRef),
      switchMap(() => this.structureService.getById(this.structureId())),
      shareReplay(),
    );
  }

  reload() {
    this.reloadStructure$.next();
  }

  onEdit() {
    this.edit.emit(this.structureId());
  }

  onDelete() {
        this.structureService.delete(this.structureId()).subscribe(() => this.deleted.emit());
  }

  onArchive(isArchived: boolean) {
    this.confirmationService.confirm({
      message: isArchived ? 'Voulez-vous désarchiver ce contact?' : 'Voulez-vous archiver ce contact?',
      icon: 'icon-warning',
      header:'Confirmation',
      dismissableMask: true,
      accept: () => {
        this.structure$.pipe(
          take(1),
          switchMap((structure: Structure) => this.structureService.update({
            ...structure,
            archive: isArchived ? false : true,
          },
          this.structureId())),
        ).subscribe(() => {
          this.reload();
        });
      }
    });
  };
}
