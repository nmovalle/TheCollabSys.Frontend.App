import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../guards/auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Verifica si la solicitud es parte del proceso de autenticación con Google
    if (this.shouldExcludeToken(req.url)) {
      return next.handle(req);
    }

    // Obtén el token de autorización
    const authToken: string | null = this.authService.getAccessToken();

    // Si hay un token, clona la solicitud y agrega el encabezado de autorización
    if (authToken) {
      const authReq = this.addToken(req, authToken);
      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error, req, next))
      );
    } else {
      // Si no hay token, simplemente pasa la solicitud original al siguiente manejador
      return next.handle(req);
    }
  }

  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    const { userId } = this.authService.getUserRole();
    const { companyId } = this.authService.getUserCompany();
    const headers = req.body instanceof FormData ? {
      Authorization: `Bearer ${token}`,
      'User-Id': `${userId}`,
      'Company-Id': `${companyId}`,
    } : {
      Authorization: `Bearer ${token}`,
      'User-Id': `${userId}`,
      'Company-Id': `${companyId}`,
      'Content-Type': req.headers.get('Content-Type') || 'application/json'
    };

    return req.clone({
      setHeaders: headers
    });
  }

  private handleError(error: HttpErrorResponse, req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (error.status === 401) {      
      const refreshToken = this.authService.getRefreshToken();
      if (refreshToken) {
        return this.authService.refreshToken(refreshToken).pipe(
          switchMap((response) => {
            this.authService.setAccessToken(response.accessToken);
            this.authService.setRefreshToken(response.refreshToken);
            const authReq = this.addToken(req, response.accessToken);
            return next.handle(authReq);
          }),
          catchError(err => {
            // Si la solicitud de refresh token falla, maneja el error adecuadamente (redirección a login, etc.)
            this.authService.logout(); // Opcional: puedes hacer logout del usuario
            return throwError(err);
          })
        );
      }
    }
    console.error('HTTP error:', error);
    return throwError(() => error);
  }

  private shouldExcludeToken(url: string): boolean {
    const excludedUrls = [
      'https://accounts.google.com/.well-known/openid-configuration',
      'https://www.googleapis.com/oauth2/v3/certs'
    ];
    return excludedUrls.some(excludedUrl => url.startsWith(excludedUrl));
  }
}
