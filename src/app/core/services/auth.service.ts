
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
  private hasAttemptedTokenFetch: boolean = false;
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
          return of(true); // L'utilisateur est déjà authentifié
        }

        // Vérifiez si une vérification d'authentification est déjà en cours
        if (this.isCheckingAuth) {
          return of(false); // Si la vérification est déjà en cours, ne rien faire
        }

        // Si une tentative de récupération du token a déjà été faite, ne pas réessayer
        if (this.hasAttemptedTokenFetch) {
          return of(false); // Éviter d'envoyer plusieurs requêtes
        }

        this.isCheckingAuth = true; // Marquer que la vérification est en cours
        this.hasAttemptedTokenFetch = true; // Marquer qu'une tentative a été faite

        return this.getTokenInfo().pipe(
          tap(fetchedUser => {
            if (fetchedUser) {
              this.user$.next(fetchedUser); // Mettre à jour l'utilisateur si trouvé
            } else {
              this.user$.next(null); // Aucun utilisateur trouvé
            }
          }),
          map(fetchedUser => {
            return !!fetchedUser; // Retourner true si l'utilisateur est authentifié
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
  return this.http.get<{ user: User, token: string, expire: number }>(`${this.apiUrl}/auth/session`).pipe(
    map(response => {
      // Assurez-vous que la réponse contient bien un utilisateur
      if (response && response.user) {
        return response.user; // Retourne l'utilisateur extrait de la réponse
      }
      return null; // Retourne null si l'utilisateur n'est pas présent
    }),
    catchError(error => {
      console.error('Error fetching token info', error); // Log the error
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
    return this.http.post<Auth>(`${environment.apiUrl}/auth/signin`, details).pipe(
      switchMap(response => {
        if (response) {
          const { user } = response;
          this.hasAttemptedTokenFetch = false
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
    // Fournissez un objet vide comme deuxième paramètre pour le corps de la requête
    this.http.post<void>(`${environment.apiUrl}/auth/signout`, {}, { withCredentials: true })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.cookieService.delete(AuthService.COOKIE_TOKEN);
          this.hasAttemptedTokenFetch = false; // Supprimez le cookie en mémoire (même s'il est httpOnly)
          this.user$.next(null); // Réinitialisez l'état de l'utilisateur
        },
        error: (error) => {
          console.error('Error during signout:', error); // Gestion d'erreur
        },
        complete: () => {
          this.router.navigate(['/auth']); // Redirection vers la page de connexion
        }
      });
  }
  
  getUserConnectedId(): Observable<number | null> {
    return this.user$.pipe(
      map(user => user ? user.id : null), // Retourne l'ID de l'utilisateur ou null s'il n'est pas connecté
      catchError(error => {
        console.error('Error fetching user ID:', error); // Gérer les erreurs
        return of(null); // Retourne null en cas d'erreur
      })
    );
  }
}
