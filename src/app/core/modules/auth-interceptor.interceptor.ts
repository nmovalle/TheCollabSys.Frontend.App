import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../guards/auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(req.url)
    // Verifica si la solicitud ya tiene un encabezado de autorización
    if (req.headers.has('Authorization')) {
      // Si ya tiene un encabezado de autorización, simplemente pasa la solicitud al siguiente manejador
      return next.handle(req);
    }

    // Verifica si la solicitud es parte del proceso de autenticación con Google
    if (this.shouldExcludeToken(req.url)) {
      // Si es parte del proceso de autenticación con Google, simplemente pasa la solicitud al siguiente manejador
      return next.handle(req);
    }

    // Obtén el token de autorización
    const authToken: string | null = this.authService.getAccessToken();

    // Si hay un token, clona la solicitud y agrega el encabezado de autorización
    if (authToken) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
      
      console.log('Request with Authorization Token:', authReq);

      // Continúa con la solicitud modificada
      return next.handle(authReq).pipe(
        catchError((error: any) => {
          return this.handleError(error);
        })
      );
    } else {
      // Si no hay token, simplemente pasa la solicitud original al siguiente manejador
      return next.handle(req);
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      console.error('Unauthorized request:', error.message);
      // Aquí podrías ejecutar un flujo de re-autenticación o redirigir al usuario
    } else {
      console.error('HTTP error:', error);
    }
    return throwError(() => error);
  }

  private shouldExcludeToken(url: string): boolean {
    // Lista de URL que se excluyen del proceso de agregación de token
    const excludedUrls = [
      'https://accounts.google.com/.well-known/openid-configuration',
      'https://www.googleapis.com/oauth2/v3/certs'
    ];
  
    // Verifica si la URL de la solicitud está en la lista de URL excluidas
    return excludedUrls.some(excludedUrl => url.startsWith(excludedUrl));
  }
}
