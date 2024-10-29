import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './empty-list.component.html',
  styleUrls: ['./empty-list.component.scss'],
  standalone: true,
  imports : [
    CommonModule,
  ],
})
export class EmptyListComponent {

  message = input<string>('Aucun élément à afficher');

  constructor() { }


}
