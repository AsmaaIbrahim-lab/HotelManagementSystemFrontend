import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { getApiErrorMessage } from '../models/api-error.model';

const PUBLIC_URLS = ['/auth/login', '/auth/register'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  const isPublic = PUBLIC_URLS.some((url) => req.url.includes(url));
  const token = authService.getToken();

  const authReq = !isPublic && token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isPublic) {
        authService.logout();
        notificationService.error('Session expired. Please log in again.');
        void router.navigate(['/login']);
        return throwError(() => error.error ?? error);
      }

      if (error.status === 400 && error.error?.errors) {
        return throwError(() => error.error);
      }

      if (!isPublic && error.status !== 400) {
        const message = getApiErrorMessage(error.error ?? error);
        if (error.status === 403) {
          notificationService.error(message || 'You do not have permission to perform this action.');
        } else if (error.status === 404) {
          notificationService.error(message || 'The requested resource was not found.');
        } else if (error.status >= 500) {
          notificationService.error(message || 'A server error occurred. Please try again later.');
        }
      }

      return throwError(() => error.error ?? error);
    })
  );
};
