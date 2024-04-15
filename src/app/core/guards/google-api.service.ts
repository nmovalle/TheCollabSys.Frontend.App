import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConfig, OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
import { Observable, Subject } from 'rxjs';
import { UserInfo } from '../../pages/login/user-info';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { LoadingService } from '@app/core/guards/loading.service';
import { HttpClient } from '@angular/common/http';
import { GoogleUserInfo } from '../interfaces/google-user-info';

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {
  userProfileSubject = new Subject<UserInfo>();

  constructor(
    private http: HttpClient,
    private readonly oAuthService: OAuthService,
    private router: Router,
    private location: Location,
    private loadingService: LoadingService,
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

    this.oAuthService.events.subscribe((event: OAuthEvent) => {
      if (event.type === 'token_received') {
        this.startLoading();
          setTimeout(() => {
            this.stopLoading();
            this.router.navigate(['/home']);
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

  getProfile(): GoogleUserInfo {
    const profile: any = this.oAuthService.getIdentityClaims();
    const mappedProfile: GoogleUserInfo = {
      at_hash: profile.at_hash || '',
      aud: profile.aud || '',
      azp: profile.azp || '',
      email: profile.email || '',
      email_verified: profile.email_verified || false,
      exp: profile.exp || 0,
      family_name: profile.family_name || '',
      given_name: profile.given_name || '',
      hd: profile.hd || '',
      iat: profile.iat || 0,
      iss: profile.iss || '',
      jti: profile.jti || '',
      name: profile.name || '',
      nbf: profile.nbf || 0,
      nonce: profile.nonce || '',
      picture: profile.picture || '',
      sub: profile.sub || ''
    };
    console.log(mappedProfile);
    return mappedProfile;
  }

  getToken() {
    return this.oAuthService.getAccessToken();
  }

  isLoggedIn() {
    if (!this.getToken()) return false;

    return true;
  }
}
