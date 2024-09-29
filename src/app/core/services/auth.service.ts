
import { Injectable, DestroyRef } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.class';
import { ReplaySubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { switchMap, catchError, tap, map, finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CookieService } from 'ngx-cookie-service';
import { Auth } from '../models/auth.class';
interface SigninDetails {
  login: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private static readonly COOKIE_TOKEN = 'Tickly';
  private user$: ReplaySubject<User | null> = new ReplaySubject<User | null>(1);
  private apiUrl = environment.apiUrl;

  private isCheckingAuth: boolean = false; // État pour vérifier si l'authentification est en cours

  constructor(
    private http: HttpClient,
    private router: Router,
    private destroyRef: DestroyRef,
    private cookieService: CookieService
  ) {
    this.tryRetrieveSession(); // Tentative de récupération de session au démarrage
  }

  get user(): Observable<User | null> {
    return this.user$.asObservable();
  }

  // Vérification de l'authentification de l'utilisateur
  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(
      switchMap(user => {
        if (user) {
          return of(true); // Si un utilisateur est présent
        }

        // Vérifiez si une vérification d'authentification est déjà en cours
        if (this.isCheckingAuth) {
          return of(false); // Retourne false si la vérification est déjà en cours
        }

        this.isCheckingAuth = true; // Marquer que la vérification est en cours

        // Sinon, tenter de récupérer la session
        return this.getTokenInfo().pipe(
          tap(fetchedUser => {
            if (fetchedUser) {
              this.user$.next(fetchedUser); // Mettre à jour l'utilisateur si trouvé
            } else {
              this.user$.next(null); // Aucun utilisateur trouvé
              console.log('No user found after session check');
            }
          }),
          map(fetchedUser => {
            console.log(fetchedUser);
            if (!fetchedUser) {
              return false; // Retourne false si pas d'utilisateur
            }
            return true; // Retourne true si l'utilisateur est authentifié
          }),
          catchError(error => {
            console.error('Error during authentication check:', error); // Log error
            return of(false); // Considérer que l'utilisateur n'est pas authentifié
          }),
          finalize(() => {
            this.isCheckingAuth = false; // Réinitialiser l'état après la vérification
          })
        );
      })
    );
  }

  private getTokenInfo(): Observable<User | null> {
    // Vérifiez d'abord si le cookie d'authentification est présent
    if (!this.cookieService.check(AuthService.COOKIE_TOKEN)) {
      return of(null); // Retourne null si le cookie n'existe pas, évitant un appel réseau
    }

    return this.http.get<User>(`${environment.apiUrl}/auth/session`).pipe(
      catchError(error => {
        console.error('Error fetching token info', error); // Log error message
        return of(null); // Retourne null en cas d'erreur
      })
    );
  }

  tryRetrieveSession(): void {
    this.getTokenInfo().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(user => {
      this.user$.next(user); // Mettre à jour l'utilisateur si la session est valide
    });
  }

  // Connexion et récupération des informations utilisateur
  signIn(details: SigninDetails): Observable<Auth | null> {
    const options = { withCredentials: true };
    return this.http.post<Auth>(`${environment.apiUrl}/auth/signin`, details, options).pipe(
      switchMap(response => {
        if (response) {
          const { user, token } = response;
          this.cookieService.set(AuthService.COOKIE_TOKEN, token, 1); // Stocker le token dans un cookie
          this.user$.next(user); // Mise à jour de l'utilisateur en mémoire
          return of(response);
        }
        return of(null);
      }),
      catchError(error => {
        console.error('Error during sign-in:', error);
        return of(null);
      })
    );
  }

  // Déconnexion de l'utilisateur
  signOut(): void {
    this.http.get<boolean>(`${environment.apiUrl}/auth/signout`, { withCredentials: true }) // Correction de l'URL pour déconnexion
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.cookieService.delete(AuthService.COOKIE_TOKEN);
        this.user$.next(null); // Réinitialise l'utilisateur en mémoire
        this.router.navigate(['/auth']); // Redirection vers la page de connexion
      });
  }
}
