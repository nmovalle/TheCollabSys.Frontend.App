import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { GoogleApiService } from './services/google-api.service';
import { UserInfo } from './user-info';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  userInfo?: UserInfo;

  constructor(
    private messageService: MessageService,
    private readonly googleApi: GoogleApiService
  ) {
    googleApi.userProfileSubject.subscribe(info => {
      this.userInfo = info;
    })
  }

  signInGoogle() {
    if (!this.isLoggedIn()) {
      this.googleApi.signIn();
    }
  }

  isLoggedIn(): boolean {
    return this.googleApi.isLoggedIn();
  }
}
