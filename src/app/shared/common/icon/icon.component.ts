import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {
  // component for generating icons with spans, this is necessary for the icons with multiples colors
  icon = input.required<string>();
  span = input<number>();
  
  arraySpan: number[] = [];

  constructor() { }

  ngOnInit(): void {
    this.initSpanArray();
  }

  initSpanArray() {
    if (this.span() > 0) {
      for (let index = 1; index <= this.span(); index++) {
        this.arraySpan.push(index)
      }
    }
  }

}
