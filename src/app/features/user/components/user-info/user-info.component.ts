import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, ViewChild } from '@angular/core';
import { RightPanelSection } from '@app/core/models/enums/right-panel-section.enum';
import { User } from '@app/core/models/user.class';
import { AvatarComponent } from '@app/shared/common/avatar/avatar.component';
import { FlagComponent } from '@app/shared/common/flag/flag.component';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    AvatarComponent,
    OverlayPanelModule,
    FlagComponent,
  ]
})
export class UserInfoComponent {

  user = input<User>();
  sectionDisplayed = input<RightPanelSection>();
  
  edit = output<User>();

  @ViewChild('op') op: OverlayPanel;  

  constructor() { }

  initials(user: User) {
    return `${user.firstname.charAt(0).toUpperCase()}${user.lastname.charAt(0).toUpperCase()}`
  }

  update() {
    this.edit.emit(this.user());
  }

  get sectionInfoDisplayed() {
    return this.sectionDisplayed() === RightPanelSection.RIGHT_PANEL_SECTION_INFO;
  }
}
