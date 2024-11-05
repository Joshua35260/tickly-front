import { HttpEvent, HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

// Fonction intercepteur d'erreur
export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        // Erreur côté client
        errorMessage = `Client-side error: ${error.error.message}`;
      } else {
        // Erreur côté serveur
        errorMessage = `Server error: ${error.status} ${error.message}`;
      }

      // Affiche le message d'erreur via MessageService
      const messageService = new MessageService();
      messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
      console.error('Intercepted error:', error);

      return throwError(() => new Error(errorMessage));
    })
  );
};
