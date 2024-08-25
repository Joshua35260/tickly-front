import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home.container',
  templateUrl: './home-container.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeContainerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
