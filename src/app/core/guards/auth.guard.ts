import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GoogleApiService } from '@app/core/guards/google-api.service';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const googleService = inject(GoogleApiService);
  const authService = inject(AuthService);
  const router = inject(Router);
  

  if (googleService.isLoggedIn()) {
    const profile = googleService.getProfile();
    authService.validateOAuthDomain(profile).subscribe({
      next: (response: any) => {
        debugger;
        // Manejar la respuesta del servicio aquí
        console.log('Respuesta del servicio:', response);
      },
      error: (error: any) => {
        console.error('Error en la solicitud:', error);
        return false;
      }
    });



    if (state.url === '/home') return true;
    else {
      console.log(profile);

      //checar permisos de menus
      return true;
    }
  } else {
    router.navigate(['/'], { replaceUrl: true });
    return false;
  }

  //pendiente agregar un AuthService para validar la sesión directamente de nuestra Base Datos
};
