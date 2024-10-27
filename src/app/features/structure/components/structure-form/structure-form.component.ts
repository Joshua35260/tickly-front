import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  output,
  DestroyRef,
  input,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Structure } from '@app/core/models/structure.class';
import { StructureService } from '@app/core/services/structure.service';
import { InputComponent } from '@app/shared/common/input/input.component';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MultiSelectModule } from 'primeng/multiselect';
import { distinctUntilChanged, startWith } from 'rxjs';

@Component({
  selector: 'app-structure-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './structure-form.component.html',
  styleUrls: ['structure-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MultiSelectModule,
    ButtonModule,
    InputComponent,
    InputSwitchModule,
    DropdownModule,
  ],
})
export class StructureFormComponent implements OnInit {saved = output<Structure>();
  cancel = output<void>();

  structure = input<Structure>();
  structure$ = toObservable(this.structure);
  structureForm: FormGroup;




  constructor(
    private destroyRef: DestroyRef,
    private structureService: StructureService
  ) {
    this.structure$
      .pipe(
        startWith(this.structure()),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((structure) => {
        if (structure) {
          this.structureForm.patchValue(structure);
        }
      });
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.structureForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]), // Valeur associée au type de contact
      phone: new FormControl(''),
      service: new FormControl(''),
      type: new FormControl(''),
      address: new FormGroup({
        streetL1: new FormControl(''),
        streetL2: new FormControl(''),
        postcode: new FormControl(''),
        city: new FormControl(''),
        country: new FormControl(''),
      }),
    });
  }

  onSave() {
    if (this.structureForm.valid) {
      const structure: Structure = {
        ...this.structureForm.value,
      };

      this.structureService
        .create(structure)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((structureCreated: Structure) => {
          this.saved.emit(structureCreated);
        });
    }
  }

  onCancel() {
    this.structureForm.reset();
    this.cancel.emit();
  }
}