import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { MenuRoleDetailDTO } from '../interfaces/menu';

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
      const usermenu = authService.getUsermenu();
      const hasAccessPermission = usermenu?.find(menuItem => authService.findMenuItemWithPermission(state.url, menuItem));
      if (hasAccessPermission !== undefined) return true;
      
      router.navigate(['/'], { replaceUrl: true });
      return false;
    }
  } else {
    router.navigate(['/'], { replaceUrl: true });
    return false;
  }
};
