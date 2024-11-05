import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormDialogComponent, FormDialogSize } from '../../common/form-dialog/form-dialog.component';
import { WidgetTitleComponent } from '../../common/widget-title/widget-title.component';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule,
    FormDialogComponent,
    WidgetTitleComponent,
  ]
})
export class WidgetComponent {
  // dialog 
  open = model<boolean>(false);

  size = input<FormDialogSize>();
  dialogTitle = input<string>();
  dialogSubtitle = input<string>();
  dialogIcon = input<string>();
  withFooter = input<boolean>(false);
  withoutDialog = input<boolean>(false);
  withTopFooter = input<boolean>(false);

  noPadding = input<boolean>(false);
  constructor() {}  
}
