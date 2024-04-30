import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    const userRole = authService.getUserRole();    
    if (userRole?.roleName === "Guest") {
      router.navigate(['/guest'], { replaceUrl: true });
      return false;
    }

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
