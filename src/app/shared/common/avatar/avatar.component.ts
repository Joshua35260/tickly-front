import { CommonModule } from '@angular/common';
import { Component, DestroyRef, input, model, OnInit } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ResizeService } from '@app/core/services/resize.service';
import { colorFromText } from '@app/core/utils/color';
import { environment } from 'environments/environment';
import { Observable} from 'rxjs';



@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
  ],
})
export class AvatarComponent implements OnInit {
  fileDownloadUrl: string = environment.fileDownloadUrl;
  fullname = input<string>();
  size = model<number>(64);
  height = input<number>(0);
  width = input<number>(0);
  avatarUrl = input<string>();

  avatarUrl$: Observable<File | string> = toObservable(this.avatarUrl);
  baseSize: number;
constructor(
  private resizeService: ResizeService,
  private destroyRef: DestroyRef,  
) {}


ngOnInit() {
  this.baseSize = this.size(); 
  this.resizeService.resize$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({ width }) => {
    if (!this.width() || !this.height()) return; // css only if width and height are set
    this.checkScreenSize(width);
  });
}
checkScreenSize(width: number): void {
  if (width <= 575) {
    this.size.set(this.baseSize * 0.75);
  } else if (width >= 575 && width <= 991) {
    this.size.set(this.baseSize * 0.8);
  } else if (width >= 992 && width <= 1330) {
    this.size.set(this.baseSize * 0.9);
  } else {
    this.size.set(this.baseSize);
  }
}

get initials() {
  if (typeof this.fullname() === 'string') {
    // Supprime les caractères non alphabétiques, sépare les mots et filtre les non-vides
    const names = this.fullname()
      .split(/[\s-]+/)               // Sépare par espaces ou tirets
      .filter(name => name.length)   // Filtre les mots non vides
      .map(name => name.replace(/[^a-zA-Z]/g, '')); // Enlève les caractères non alphabétiques
    
    if (names.length >= 2) {
      // Prend la première lettre de chaque des deux premiers noms pour former les initiales
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    } else if (names.length === 1) {
      // Si une seule partie est présente, retourne les deux premières lettres
      return names[0].slice(0, 2).toUpperCase();
    }
  }
  return '';
}




  get color(): string {
    return colorFromText(this.initials);
  }

  calculateFontSize(): number {
    const avatarSize = this.width() ||this.size();
    const fontSizeRatio = 0.45;
    const fontSize = avatarSize * fontSizeRatio;

    return fontSize;
  }

  handleAvatarError() {
    console.error('Avatar not found');
    //todo: handle error globally via a service for displaying custom error message like here for url broken
  }


}