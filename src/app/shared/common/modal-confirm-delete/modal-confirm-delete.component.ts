
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, input, model, OnInit, output, signal, WritableSignal } from '@angular/core';
import { outputToObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Observable } from 'rxjs';
import { FormDialogComponent, FormDialogSize } from '../form-dialog/form-dialog.component';
import { InputComponent } from '../input/input.component';
import { PanelService } from '@app/core/services/panel.service';

@Component({
  selector: 'app-modal-confirm-delete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal-confirm-delete.component.html',
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    ButtonModule,
    DialogModule,
    ReactiveFormsModule,
    FormDialogComponent,
  ],
  styleUrls: [ './modal-confirm-delete.component.scss' ],
})
export class ModalConfirmDeleteComponent implements OnInit {
  closeDialog = output<void>();
  delete = output<void>();

  title = input<string>('Voulez-vous vraiment supprimer cet élément ?');
  size = input<FormDialogSize>('xxlarge');
  visible = model<boolean>(false);

  canDelete: WritableSignal<boolean> = signal(false);
  deleteForm: FormGroup;
  showDelete$: Observable<void> = outputToObservable(this.delete);
  constructor(
    private destroyRef: DestroyRef,
    private panelService: PanelService
  ) { }

  ngOnInit() {
    this.deleteForm = new FormGroup({
      delete: new FormControl('', [ Validators.required ]),
    });

    this.deleteForm.controls['delete'].valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((deleteValue) => {
      if (deleteValue === 'supprimer') {
        this.canDelete.set(true);
      } else {
        this.canDelete.set(false);

      }
    });
  }

  showDelete(): Observable<void> {
    this.visible.set(true);
    return this.showDelete$;
  }

  onDelete() {
    if (this.deleteForm.valid && this.deleteForm.controls['delete'].value === 'supprimer') {
    this.delete.emit();
    this.deleteForm.reset();
    this.closeDialog.emit();
    this.visible.set(false);
    this.panelService.closePanel();
    }
  }

  onCancel() {
    this.deleteForm.reset();
    this.closeDialog.emit();
    this.visible.set(false);
  }

}
