import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { PrimaryNavbarComponent } from './shared/primary-navbar/primary-navbar.component';
import { filter } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, PrimaryNavbarComponent],
 
})
export class AppComponent {
  title = 'Tickly';
  showNavbar = true;
  constructor(private router: Router) {
    // Ecouter les événements de navigation pour ajuster l'affichage de la navbar
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Vérifier les données de la route active
        const currentRoute = this.router.routerState.root.firstChild;
        if (currentRoute) {
          this.showNavbar = currentRoute.snapshot.data['withNavbar'] !== false;
        }
      });
  }
}
