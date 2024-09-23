import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { User } from '@app/core/models/user.class';
import { AuthService } from '@app/core/services/auth.service';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'app-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MenuModule, AvatarComponent],
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent {
  headerTexts$: Observable<any>;
  userConnected$: Observable<User>;
  userConnected = signal<User>(null);
  menuVisible = signal(false);

  items: MenuItem[] = [
    {
      label: 'Voir son profil',
      icon: 'icon-profile',
      command: () => {
        this.showProfil();
      },
    },
    {
      label: 'Se déconnecter',
      icon: 'icon-logout',
      styleClass: 'red',
      command: () => {
        this.logout();
      },
    },
  ];

  constructor(
    private destroyRef: DestroyRef,
    private route: ActivatedRoute,
    protected router: Router,
    private authService: AuthService
  ) {
    this.headerTexts$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      switchMap(() => this.route.firstChild?.data || []),
      takeUntilDestroyed(this.destroyRef),
      map((data: any) => data?.header)
    );

    this.authService.user
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        if (user) {
          console.log('user from pageheader', user);
          this.userConnected.set(user);
        }
      });
  }

  // Rediriger vers le profil de l'utilisateur
  showProfil() {
    this.router.navigate(
      [{ outlets: { panel: ['profil', 'view', this.userConnected().id] } }],
      { queryParamsHandling: 'preserve' }
    );
  }

  // Déconnecter l'utilisateur
  logout() {
    this.authService.signOut();
  }
}
