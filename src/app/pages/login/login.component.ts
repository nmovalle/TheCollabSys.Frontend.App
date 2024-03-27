import { Component } from '@angular/core';
import { MessageService } from 'primeng/api'
import { UserInfo } from '@app/core/interfaces/user-info';
import { GoogleApiService } from '@app/core/services/google-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  valCheck: string[] = ['remember'];
  password!: string;
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
