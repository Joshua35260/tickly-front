import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BoldFirstWordPipe } from '../../pipes/bold-first-word.pipe';

@Component({
  selector: 'app-widget-title',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, BoldFirstWordPipe],
  templateUrl: './widget-title.component.html',
  styleUrls: ['./widget-title.component.scss'],
})
export class WidgetTitleComponent {
  icon = input<string>();
  title = input<string>();
  subtitle = input<string>();
}
