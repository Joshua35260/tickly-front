import { StructureService } from './../../../core/services/structure.service';

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { RightPanelSection } from '@app/core/models/enums/right-panel-section.enum';
import { Structure } from '@app/core/models/structure.class';
import { MediaService } from '@app/core/services/media.service';
import { StructureViewComponent } from '@app/features/structure/structure-view/structure-view.component';

import { SidebarComponent } from '@app/shared/common/layout/sidebar/sidebar.component';
import { MenuSidebar } from '@app/shared/common/layout/sidebar/sidebar.model';

@Component({
  selector: 'app-structure-view-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './structure-view.container.component.html',
  standalone: true,
  imports: [CommonModule, StructureViewComponent, SidebarComponent],
})
export class StructureViewContainerComponent {
  structure = signal<Structure>(null);

  dataMenu = [
    {
      panel: RightPanelSection.RIGHT_PANEL_SECTION_INFO,
      title: '',
      icon: 'icon-information',
      iconSpan: 0,
    },
    {
      panel: RightPanelSection.RIGHT_PANEL_SECTION_STRUCTURES,
      title: '',
      icon: 'icon-organization',
      iconSpan: 0,
    },
    {
      panel: RightPanelSection.RIGHT_PANEL_SECTION_TICKETS,
      title: '',
      icon: 'pi pi-tags',
      iconSpan: 0,
    },
    {
      panel: RightPanelSection.RIGHT_PANEL_SECTION_HISTORICAL,
      title: '',
      icon: 'icon-history',
      iconSpan: 0,
    },
    {
      panel: RightPanelSection.RIGHT_PANEL_SECTION_ACTIONS,
      title: '',
      icon: 'icon-choice',
      iconSpan: 0,
    },
  ] as MenuSidebar[];

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected destroyRef: DestroyRef,
    private structureService: StructureService,
    private mediaService: MediaService
  ) {
    this.getStructure();
    this.structureService.entityChanged$ //recharge le ticket automatiquement si le ticket est modifié
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.getStructure());

    this.mediaService.entityChanged$ //recharge le ticket automatiquement si le ticket est modifié
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.getStructure());
  }

  getStructure() {
    this.structureService
      .getById(this.structureId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((structure: Structure) => {
        if (structure) {
          this.structure.set(structure);
        }
      });
  }
  get structureId(): number {
    return this.route.snapshot.params['id'];
  }

  get section(): RightPanelSection {
    return this.route.snapshot.params['section'];
  }

  onPanelSelected(panel: string) {
    this.router.navigate(
      [{ outlets: { panel: ['structure', 'view', this.structureId, panel] } }],
      { queryParamsHandling: 'preserve' }
    );
  }

  onEditStructure(structureId: number) {
    this.router.navigate(
      [{ outlets: { modal: ['structure', 'edit', structureId] } }],
      { queryParamsHandling: 'preserve' }
    );
  }

  onStructureDeleted() {
    this.router.navigate([{ outlets: { panel: null } }], {
      queryParamsHandling: 'preserve',
    });
  }

  close() {
    this.router.navigate([{ outlets: { panel: null } }], {
      queryParamsHandling: 'preserve',
    });
  }
}
