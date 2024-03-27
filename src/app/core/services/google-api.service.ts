import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';
import { UserInfo } from '../interfaces/user-info';

const oAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: `${window.location.origin}/home`,
  clientId: '269627077901-r0dh2ctpv4ocsl7v0lke9vk9k4isu768.apps.googleusercontent.com',
  responseType: 'code',
  scope: 'openid profile email',
  showDebugInformation: true,
}

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {
  userProfileSubject = new Subject<UserInfo>();

  constructor(
    private readonly oAuthService: OAuthService
  ) { 
    
  }

  isLoggedIn(): boolean {
    return this.oAuthService.hasValidIdToken();
  }

  signIn() {
    this.oAuthService.configure(oAuthConfig);
    this.oAuthService.loadDiscoveryDocument().then( () => {
      this.oAuthService.tryLoginImplicitFlow().then( () => {
        if(!this.oAuthService.hasValidIdToken()) {
          debugger;
          this.oAuthService.initLoginFlow();
        } else {
          debugger;

          this.oAuthService.loadUserProfile().then( (userProfile) => {
            debugger;
            this.userProfileSubject.next(userProfile as UserInfo);
            console.log(JSON.stringify(userProfile))
          })
        }
      })
    })
  }

  signOut() {
    this.oAuthService.logOut();
  }
}
