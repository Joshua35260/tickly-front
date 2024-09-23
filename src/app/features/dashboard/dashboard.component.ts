import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { WidgetTitleComponent } from '../../shared/common/widget-title/widget-title.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WidgetTitleComponent,
  ]
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
