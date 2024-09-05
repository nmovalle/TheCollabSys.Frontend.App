import { forkJoin, Observable } from "rxjs";
import { MenuRoleDetailDTO } from "../interfaces/menu";
import { AuthService, MenuError } from "./auth.service";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class AuthFlowService {
  constructor(private authService: AuthService, private router: Router) {}

  public executeAuthFlow(authMethod: () => Observable<any>, userIdOrEmail: string, stopLoadingCallback: () => void): void {
    forkJoin({
      auth: authMethod(),
      menu: this.authService.getUserMenu(userIdOrEmail),
    }).subscribe({
      next: ({ auth, menu }) => {
        if (auth.error) {
          stopLoadingCallback();
          this.authService.setGoogleAuthInProgress(true);

          if (auth.status === 404) {
            const state = { email: auth.email, domain: auth.domain, userId: auth.userId };
            this.redirectBasedOnAuthType(auth.type, state);
          }
          return;
        }

        if ((menu as MenuError).error) {
          console.error('Error en menu:', (menu as MenuError).message);
          return;
        }

        this.processSuccessfulAuth(auth, userIdOrEmail, menu, stopLoadingCallback);
      },
      error: (error: any) => {
        stopLoadingCallback();
        this.authService.setGoogleAuthInProgress(false);
        console.error('Error no manejado:', error);
      },
    });
  }

  private redirectBasedOnAuthType(authType: string, state: any): void {
    switch (authType) {
      case 'domain-master':
        localStorage.setItem('accessCodeInitialState', 'true');
        this.router.navigate(['/access-code'], { state });
        break;
      case 'user-company':
        this.router.navigate(['/domain'], { state });
        break;
      default:
        console.error('Error en auth:', 'Invalid auth type');
    }
  }

  private processSuccessfulAuth(auth: any, username: any, menu: any, stopLoadingCallback: () => void): void {
    const { userRole, authToken } = auth;
    const { accessToken, refreshToken, accessTokenExpiration } = authToken;

    this.authService.setAuthProvider("Google");
    this.authService.setUsername(username);
    this.authService.setAccessToken(accessToken);
    this.authService.setRefreshToken(refreshToken);
    this.authService.setAccessTokenExpiration(accessTokenExpiration);
    this.authService.setUserRole(userRole);

    const userMenu = menu as MenuRoleDetailDTO[];
    this.authService.setUsermenu(userMenu);

    setTimeout(() => {
      stopLoadingCallback();
      this.authService.setGoogleAuthInProgress(false);
      this.router.navigate(['/home']);
    }, 500);
  }
}
