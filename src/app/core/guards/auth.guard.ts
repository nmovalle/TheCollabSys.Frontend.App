import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GoogleApiService } from '@app/pages/login/services/google-api.service';

export const authGuard: CanActivateFn = (route, state) => {
  const googleService = inject(GoogleApiService);
  const router = inject(Router);  

  if (googleService.isLoggedIn()) {
    if (state.url === '/home') return true;
    else {
      //checar permisos de menus
      return true;
    }
  } else {
    router.navigate(['/'], { replaceUrl: true });
    return false;
  }

  //pendiente agregar un AuthService para validar la sesión directamente de nuestra Base Datos
};
