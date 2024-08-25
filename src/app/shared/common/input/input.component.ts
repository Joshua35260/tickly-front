import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  Optional,
  output,
  Self,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { AutoFocusModule } from 'primeng/autofocus';
import { FloatLabelModule } from 'primeng/floatlabel';
@Component({
  selector: 'app-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, InputTextModule, ReactiveFormsModule, AutoFocusModule, FloatLabelModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class InputComponent implements ControlValueAccessor {
  valueChange = output<string>();
  label = input<string>();
  formControlName = input<string>();
  type = input<string>('text');
  max = input<number | undefined>();
  min = input<number | undefined>();
  errorMessage = input<string>();
  // give classes to elements if needed for more customization
  classSpan = input<string>('');
  classIcon = input<string>('');
  classInput = model<string>('');
  classLabel = input<string>('');
  classSmall = input<string>('');
  autofocus = input<boolean>(false);
  notEmptyClass: string = 'empty';


  onValueChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.valueChange.emit(inputElement.value);
    this.updateClass();
  }

  get control(): FormControl {
    return this.ngControl?.control as FormControl;
  }

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }
  // Method for updating the class
  updateClass(): void {
    if (this.control?.value?.trim() !== '') {
      this.classInput.set('not-empty');
    } else {
      this.classInput.set('empty');
    }
  }

  // Implement ControlValueAccessor methods
  // (You can leave these empty as you don't use them)
  registerOnChange(fn: any): void {}
  registerOnTouched(): void {}
  setDisabledState(isDisabled: boolean): void {}
  writeValue(value : string): void {
    if (!!value) {
      this.classInput.set('not-empty');
    } else {
      this.classInput.set('empty');
    }
  }
}
