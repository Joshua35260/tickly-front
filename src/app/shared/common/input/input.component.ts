import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  Optional,
  output,
  Self,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { AutoFocusModule } from 'primeng/autofocus';

@Component({
  selector: 'app-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    ReactiveFormsModule,
    AutoFocusModule,
  ],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements ControlValueAccessor {
  valueChange = output<string>();
  label = input<string>();
  formControlName = input<string>();
  type = input<string>('text');
  max = input<number | undefined>();
  min = input<number | undefined>();
  errorMessage = input<string>();
  classIcon = input<string>('');
  iconSide = input<'left' | 'right'>('left');
  classInput = input<string>('');
  classLabel = input<string>('');
  classSmall = input<string>('');
  autofocus = input<boolean>(false);
  notEmptyClass: string = 'empty';

  onValueChange(value: string) {
    this.valueChange.emit(value);
  }

  get control(): FormControl {
    return this.ngControl?.control as FormControl;
  }

  constructor(
    @Optional() @Self() public ngControl: NgControl,

  ) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    } else {
      console.warn('NgControl not found. Make sure this component is used within a form.');
    }
  }


  // Implement ControlValueAccessor methods
  registerOnChange(fn: any): void {}
  registerOnTouched(): void {}
  setDisabledState(isDisabled: boolean): void {}
  writeValue(value): void {
    if (value) {
      this.control?.markAsDirty();
    } else {
      this.control?.markAsPristine();
    }
  }
}
