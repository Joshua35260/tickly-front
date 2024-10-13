import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, OnInit, output } from '@angular/core';
import { RightPanelSection } from '@app/core/models/enums/right-panel-section.enum';
import { Structure } from '@app/core/models/structure.class';
import { AvatarComponent } from '@app/shared/common/avatar/avatar.component';
import { WidgetTitleComponent } from '@app/shared/common/widget-title/widget-title.component';
import { WidgetComponent } from '@app/shared/common/widget/widget.component';

@Component({
  selector: 'app-structure-info',
  templateUrl: './structure-info.component.html',
  styleUrls: ['./structure-info.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    WidgetComponent,
    AvatarComponent,
    WidgetTitleComponent,
  ]
})
export class StructureInfoComponent implements OnInit {
  structure = input<Structure>();
  sectionDisplayed = input<RightPanelSection>();
  
  edit = output<Structure>();
 
  constructor() { }

  ngOnInit() {
  }
  update() {
    this.edit.emit(this.structure());
  }
}
