import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

export type FormDialogSize = 'xxlarge' | 'xlarge' | 'large' | 'medium';

@Component({
  selector: 'app-form-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    NgTemplateOutlet,

  ],
  templateUrl: './form-dialog.component.html',
  styleUrl: './form-dialog.component.scss'
})
export class FormDialogComponent {
 
  size = input<FormDialogSize>();
  scrollable = input<boolean>(true);
  visible = input<boolean>(true);

  closeDialog = output<void>();

}
