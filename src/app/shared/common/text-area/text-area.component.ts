import { CommonModule } from '@angular/common';
import { Component, Optional, Self, ChangeDetectionStrategy, input, output, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, NgControl, ControlValueAccessor, ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-text-area',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    InputTextareaModule,
    ReactiveFormsModule,
  ],
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss'],
})
export class TextAreaComponent implements ControlValueAccessor {
  @ViewChild('textareaElement') textareaElement!: ElementRef;
  valueChange = output<string>();

  label = input<string>('');
  formControlName = input<string>('');
  parentForm = input<FormGroup>();
  // rows = input<number>(5); min height define with css, cause it's bugged actually
  autoResize = input<boolean>(true);
  errorMessage = input<string>('');
  classIcon = input<string>('');
  classSpan = input<string>('');
  classTextArea = input<string>('');
  classLabel = input<string>('');
  classSmall = input<string>('');


  onValueChange(event: any) {
    this.valueChange.emit(event?.target?.value);

  }

  get control(): FormControl {
    return this.ngControl?.control as FormControl;
  }
  
  constructor(
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }


  // Method for emitting the value of the textarea
  

  // Implement ControlValueAccessor methods
  // (You can leave these empty as you don't use them)
  registerOnChange(fn: any): void { }
  registerOnTouched(): void { }
  setDisabledState(isDisabled: boolean): void { }
  writeValue(value: any): void {
    if (value) {
      this.control?.markAsDirty();
    } else {
      this.control?.markAsPristine();
    }
  }
}
