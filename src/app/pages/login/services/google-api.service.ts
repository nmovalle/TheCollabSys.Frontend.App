import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConfig, OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';
import { UserInfo } from '../user-info';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { LoadingService } from '@app/core/guards/loading.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {
  userProfileSubject = new Subject<UserInfo>();

  constructor(
    private readonly oAuthService: OAuthService,
    private router: Router,
    private location: Location,
    private loadingService: LoadingService
  ) { 
    this.initConfiguration();
  }

  startLoading() {
    this.loadingService.setLoading(true);
  }

  stopLoading() {
    this.loadingService.setLoading(false);
  }

  initConfiguration() {
    const authConfig: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      clientId: '269627077901-r0dh2ctpv4ocsl7v0lke9vk9k4isu768.apps.googleusercontent.com',
      redirectUri: `${environment.oAuthRedirectUri}`,
      scope: 'openid profile email',
    };

    this.oAuthService.configure(authConfig);
    this.oAuthService.setupAutomaticSilentRefresh();
    this.oAuthService.loadDiscoveryDocumentAndTryLogin();

    const self = this;
    // Suscribirse al evento de OAuthService para detectar cuando se recibe un token de acceso
    this.oAuthService.events.subscribe((event: OAuthEvent) => {
      if (event.type === 'token_received') {
        this.startLoading();
          console.log(this.oAuthService.getAccessToken());          
          // Esperar 2000 milisegundos (2 segundos) antes de redirigir
          setTimeout(() => {
            // Redirigir a la página de inicio
            self.router.navigate(['/home']);
        }, 500);
      }
    });
  
  }

  login() {
    this.oAuthService.initImplicitFlow();
  }

  logout() {
    this.oAuthService.revokeTokenAndLogout();
    this.oAuthService.logOut();
  }

  getProfile() {
    const profile = this.oAuthService.getIdentityClaims();
    return profile;
  }

  getToken() {
    return this.oAuthService.getAccessToken();
  }

  isLoggedIn() {
    if (!this.getToken()) return false;

    return true;
  }
}
