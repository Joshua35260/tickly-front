import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StructureCreateEditComponent } from '@app/features/structure/components/structure-create-edit/structure-create-edit.component';



@Component({
  selector: 'app-structure-edit-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './structure-edit.container.component.html',
  standalone: true,
  imports: [
    StructureCreateEditComponent,
  ]
})

export class StructureEditContainerComponent {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  get structureId(): number {
    return this.route.snapshot.params['id'];
  }

  close() {
    this.router.navigate([{ outlets: { modal: null } }], { queryParamsHandling: 'preserve' });
  }
}
