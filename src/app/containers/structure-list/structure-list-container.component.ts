import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { RightPanelSection } from '@app/core/models/enums/right-panel-section.enum';
import { StructureListComponent } from '@app/features/structure/structure-list/structure-list.component';


@Component({
  selector: 'app-structure-list.container',
  templateUrl: './structure-list-container.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    StructureListComponent,
  ]
})
export class StructureListContainerComponent  {

  constructor(
    protected router: Router,
  ) {}
  displayStructureView(structureId: number) {
    this.router.navigate([{ outlets: { panel: [ 'structure', 'view', structureId, RightPanelSection.RIGHT_PANEL_SECTION_INFO ] } }], { queryParamsHandling: 'preserve' });
  }

}
