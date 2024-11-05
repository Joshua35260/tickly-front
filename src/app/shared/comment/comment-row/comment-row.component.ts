import { environment } from './../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, input, output, signal, ViewChild } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Subject } from 'rxjs';
import { AvatarComponent } from '@app/shared/common/avatar/avatar.component';
import { Comment } from '@app/core/models/comment.class';
import { ImageModule } from 'primeng/image';
@Component({
  selector: 'app-comment-row',
  templateUrl: './comment-row.component.html',
  styleUrls: ['./comment-row.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    AvatarComponent,
    MenuModule,
    ImageModule,
],
})
export class CommentRowComponent implements AfterViewInit {
@ViewChild('cardTop') cardTopElement: ElementRef;
baseUrl = environment.baseUrl;
menuItems$= new Subject<MenuItem[]>();

comment = input.required<Comment>();
canEdit = input<boolean>();
edit = output<Comment>();
delete = output<number>();

avatarSize = signal<number>(0);
 
avatarTopHeight = signal<number>(undefined);
avatarTopWidth = signal<number>(undefined);
  constructor() { }
  getMenuItems(item: Comment) {
    this.menuItems$.next([
      {
        label: 'Modifier',
        icon: 'icon-edit',
        command: () => {
          this.edit.emit(item);
        }
      },
      {
        label: 'Supprimer',
        icon: 'icon-trashcan',
        command: () => {
          this.delete.emit(item.id);
        }
      }
    ]);
  }
  ngAfterViewInit() {
    this.avatarSize.set(parseInt(getComputedStyle(this.cardTopElement.nativeElement).getPropertyValue('--avatar-height-top').trim(),10));
    this.avatarTopHeight.set(parseInt(getComputedStyle(this.cardTopElement.nativeElement).getPropertyValue('--avatar-height-top').trim(),10));
    this.avatarTopWidth.set(parseInt(getComputedStyle(this.cardTopElement.nativeElement).getPropertyValue('--avatar-width-top').trim(), 10));
  }
}
