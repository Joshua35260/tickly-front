import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DashboardComponent } from '../../../features/dashboard/dashboard.component';

@Component({
  selector: 'app-home.container',
  templateUrl: './home-container.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DashboardComponent,
  ]
})
export class HomeContainerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
