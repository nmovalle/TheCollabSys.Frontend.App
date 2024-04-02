import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';
import { UserInfo } from '../user-info';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {
  userProfileSubject = new Subject<UserInfo>();

  constructor(
    private readonly oAuthService: OAuthService,
    private router: Router
  ) { }

  isLoggedIn(): boolean {
    return this.oAuthService.hasValidIdToken();
  }

  signIn() {
    const oAuthConfig: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      redirectUri: `${environment.oAuthRedirectUri}/home`,
      clientId: '269627077901-r0dh2ctpv4ocsl7v0lke9vk9k4isu768.apps.googleusercontent.com',
      responseType: 'code',
      scope: 'openid profile email',
      showDebugInformation: true,
    };

    this.oAuthService.configure(oAuthConfig);
    this.oAuthService.loadDiscoveryDocument().then(() => {
      this.oAuthService.tryLoginImplicitFlow().then(() => {
        if (!this.oAuthService.hasValidIdToken()) {
          this.oAuthService.initLoginFlow();
        } else {
          this.oAuthService.loadUserProfile().then((userProfile) => {


            debugger;

            this.userProfileSubject.next(userProfile as UserInfo);
            console.log(JSON.stringify(userProfile))

            //ir a nuestro al API para validar el userProfile: nestor@amec-eng.com

            
          })
        }
      })
    })
  }

  signOut() {
    if (this.isLoggedIn()) this.oAuthService.logOut();
    this.router.navigate(['/']);
  }
}
