import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/user.class';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.authService.isAuthenticated().pipe(
      map((isAuthenticated: boolean) => {
        if (!isAuthenticated) {
          // Rediriger vers la page de connexion si non authentifié
          this.router.navigate(['/auth']);
          return false;
        }
        return true;
      }),
      catchError(() => {
        // En cas d'erreur, rediriger vers la page de connexion
        this.router.navigate(['/auth']);
        return of(false);
      })
    );
  }

}
