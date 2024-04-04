import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { GoogleApiService } from './services/google-api.service';
import { UserInfo } from './user-info';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  userInfo?: UserInfo;

  constructor(
    private messageService: MessageService,
    private readonly googleService: GoogleApiService,
    private router: Router
  ) {
    const token = this.googleService.getToken();
    if (token) this.router.navigate(['/home']);
  }

  signInGoogle() {
    this.googleService.login();
  }
}
