import { DestroyRef, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.class';
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
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

  private static readonly USER_LOGIN = 'likorn-login';
  private static readonly LIKORN_TOKEN = 'likorn-token';
  private static readonly LIKORN_TOKEN_EXPIRES = 'likorn-token-expires';

  private user$: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private destroyRef: DestroyRef
  ) {
    this.checkCookie().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  get user(): Observable<User> {
    return this.user$.asObservable();
  }

  signIn(details: SigninDetails): Observable<Auth> {
    console.log('details', details);

    const options = { withCredentials: true };

    return this.http
      .post<Auth>(`${this.apiUrl}/auth/signin`, details, options)
      .pipe(
        switchMap((response) => {
          if (response) {
            const { user, token } = response; // Déstructurer l'utilisateur et le token
            this.user$.next(user); // Mettre à jour l'utilisateur
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

  checkCookie(): Observable<boolean> {
    const cookieName = AuthService.LIKORN_TOKEN;
    const cookies = document.cookie.split(';');
    let cookieValue = '';

    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(cookieName + '=')) {
        cookieValue = cookie.substring(cookieName.length + 1);
        break;
      }
    }

    if (cookieValue) {
      try {
        const decodedToken: any = jwtDecode(cookieValue);
        const expiresAt = decodedToken.exp * 1000;

        if (expiresAt > Date.now()) {
          this.user$.next(decodedToken.user);
          return of(true); // L'utilisateur est authentifié
        }
      } catch (error) {
        console.error('Token decoding error:', error);
      }
    }

    this.user$.next(null); // L'utilisateur n'est pas authentifié
    return of(false);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`http://localhost:3000/api/user`);
  }

  getLogin(): string {
    return localStorage.getItem(AuthService.USER_LOGIN);
  }

  signOut() {
    this.user$.next(null);
    this.router.navigate(['/auth']);
  }
}
