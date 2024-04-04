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
  }

  signInGoogle() {
    this.googleApi.login();
  }
}
