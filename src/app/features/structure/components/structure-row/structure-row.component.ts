import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { Structure } from '@app/core/models/structure.class';
import { AvatarComponent } from '@app/shared/common/avatar/avatar.component';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-structure-row',
  templateUrl: './structure-row.component.html',
  styleUrls: ['./structure-row.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MenuModule, AvatarComponent],
})
export class StructureRowComponent implements AfterViewInit {
  @ViewChild('cardTop') cardTopElement: ElementRef;
  @ViewChild('cardBottom') cardBottomElement: ElementRef;

  delete = output<number>();
  menuOpened = output<number>();
  openStructure = output<number>();

  structure = input.required<Structure>();
  withMenu = input<boolean>(false);
  menuItemsInput = input<MenuItem[]>();
  
  avatarTopHeight = signal<number>(undefined);
  avatarTopWidth = signal<number>(undefined);
  avatarBottomHeight = signal<number>(undefined);
  avatarBottomWidth = signal<number>(undefined);
  iconColor = signal<string>('');
 

  constructor() {}

  ngAfterViewInit() {
    this.avatarTopHeight.set(
      parseInt(
        getComputedStyle(this.cardTopElement.nativeElement)
          .getPropertyValue('--avatar-height-top')
          .trim(),
        10
      )
    );
    this.avatarTopWidth.set(
      parseInt(
        getComputedStyle(this.cardTopElement.nativeElement)
          .getPropertyValue('--avatar-width-top')
          .trim(),
        10
      )
    );
  }
  onMenuClick(event: Event, menu: any): void {
    menu.toggle(event);
    this.menuOpened.emit(this.structure().id);
  }
}
