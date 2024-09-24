import { DestroyRef, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.class';
import {
  BehaviorSubject,
  catchError,
  filter,
  Observable,
  of,
  switchMap,
  take,
} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavigationEnd, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Auth } from '../models/auth.class';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface SigninDetails {
  login: string;
  password: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  private static readonly USER_LOGIN = 'Tickly-login';
  private static readonly LIKORN_TOKEN = 'Tickly';

  private user$: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private destroyRef: DestroyRef
  ) {
    this.checkToken().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef),
  ).subscribe(() => {
      if (!this.user$.value) {
          this.fetchUserFromToken();
      }
  });;
  }

  get user(): Observable<User> {
    return this.user$.asObservable();
  }
  fetchUserFromToken() {
    const tokenFromLocalStorage = localStorage.getItem(
      AuthService.LIKORN_TOKEN
    );
    if (tokenFromLocalStorage) {
      const decodedToken: any = jwtDecode(tokenFromLocalStorage);
      const userId = decodedToken.userId;
      if (!this.user$.value) {
        this.fetchUser(userId);
      }
    }
  }

  fetchUser(userId: number) {
    if (this.user$.value) {
        return;
    }

    this.http.get<User>(`${this.apiUrl}/user/${userId}`).pipe(
        switchMap(user => {
            this.user$.next(user);
            return of(true);
        }),
        catchError(err => {
            console.error('Failed to fetch user details:', err);
            this.user$.next(null);
            return of(false);
        })
    ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
}


  signIn(details: SigninDetails): Observable<Auth> {

    const options = { withCredentials: true };

    return this.http
      .post<Auth>(`${this.apiUrl}/auth/signin`, details, options)
      .pipe(
        switchMap((response) => {
          if (response) {
            const { user, token } = response;
            this.user$.next(user);
            localStorage.setItem(AuthService.USER_LOGIN, details.login);
            localStorage.setItem(AuthService.LIKORN_TOKEN, token); // Stocker le token dans le localStorage en + du cookie
            return of(response);
          }
          return of(null);
        }),
        catchError((error) => {
          console.error('Error during sign-in:', error);
          return of(null);
        })
      );
  }

  checkToken(): Observable<boolean> {
    const tokenFromLocalStorage = localStorage.getItem(
      AuthService.LIKORN_TOKEN
    );
    if (tokenFromLocalStorage) {
      try {
        const decodedToken: any = jwtDecode(tokenFromLocalStorage);
        const expiresAt = decodedToken.exp * 1000;

        if (expiresAt > Date.now()) {
 
          return of(true); // L'utilisateur est authentifié
        } else {
          console.warn('Token expired:', new Date(expiresAt), 'Current time:', new Date());
        }
      } catch (error) {
        console.error('LocalStorage token decoding error:', error);
      }
    }

    this.user$.next(null);
    return of(false); // L'utilisateur n'est pas authentifié
  }

  getLogin(): string {
    return localStorage.getItem(AuthService.USER_LOGIN);
  }

  signOut() {
    this.user$.next(null);
    this.router.navigate(['/auth']);
  }
}
