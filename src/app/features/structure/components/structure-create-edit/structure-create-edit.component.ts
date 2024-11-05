import { StructureService } from '@app/core/services/structure.service';
import { Structure } from '@app/core/models/structure.class';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  input,
  output,
  signal,
} from '@angular/core';
import { StructureFormComponent } from '../structure-form/structure-form.component';
import { WidgetTitleComponent } from '@app/shared/common/widget-title/widget-title.component';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, startWith, take } from 'rxjs';

@Component({
  selector: 'app-structure-create-edit',
  templateUrl: './structure-create-edit.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, StructureFormComponent, WidgetTitleComponent],
})
export class StructureCreateEditComponent {
  saved = output<void>();
  
  structureId = input<number>();
  structureId$ = toObservable(this.structureId);
  structure = signal<Structure>(null);
  constructor(
    private destroyRef: DestroyRef,
    private structureService: StructureService
  ) {
    this.structureId$
      .pipe(
        startWith(this.structureId()),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((structureId) => {
        if (structureId) {
          this.structureService
            .getById(structureId)
            .pipe(take(1))
            .subscribe((structure) => {
              this.structure.set(structure);
            });
        }
      });
  }
}
