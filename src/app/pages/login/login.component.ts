import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { GoogleApiService } from '@app/core/guards/google-api.service';

import { UserInfo } from './user-info';
import { Router } from '@angular/router';
import { LoadingService } from '@app/core/guards/loading.service';
import { UserService } from '@app/core/service/user.service';
import { AuthService } from '@app/core/guards/auth.service';
import { forkJoin } from 'rxjs';
import { MenuRoleDetailDTO } from '@app/core/interfaces/menu';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  userInfo?: UserInfo;
  loading: boolean = false;
  email!: string;
  password!: string;

  constructor(
    private messageService: MessageService,
    private readonly googleService: GoogleApiService,
    private router: Router,
    private loadingService: LoadingService,
    private userService: UserService,
    private authService: AuthService
  ) {
  }

  signInGoogle() {
    this.googleService.login();
  }

  signInCredentials() {
    if (!this.email || !this.password) {
      this.messageService.add({severity:'error', summary:'Error', detail:'Email and Password are required'});
      return;
    }

    this.loading = true;
    const credentials = {
      userName: this.email,
      password: this.password
    };
    this.userService.login(credentials).subscribe({
      next: (response: any) => {
        const { userRole, authToken } = response;
        const { accessToken, refreshToken, accessTokenExpiration } = authToken;

        this.authService.setAuthProvider("Credentials");
        this.authService.setUsername(credentials.userName);
        this.authService.setAccessToken(accessToken);
        this.authService.setRefreshToken(refreshToken);
        this.authService.setAccessTokenExpiration(accessTokenExpiration);
        this.authService.setUserRole(userRole);

        forkJoin({
          menu: this.authService.getUserMenu(credentials.userName),
          passwordConfirmed: this.userService.getUserPasswordConfirmed(credentials.userName)
        }).subscribe(({ menu, passwordConfirmed }) => {
          const { data } = passwordConfirmed;
          const isPasswordConfirmed = data.passwordConfirmed;

          const userMenu = menu as MenuRoleDetailDTO[];
          this.authService.setUsermenu(userMenu);
          
          if (!isPasswordConfirmed) {
            this.authService.setChangePasswordConfirmed(true);
            return this.router.navigate([`/change-password/${userRole.userId}`], { replaceUrl: true });
          }
        
          return this.router.navigate(['/home']);
        });
        
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({severity:'error', summary:'Error', detail:'Invalid username or password'});
      }
    });
  }

  ngOnInit() {    
    this.loadingService.loading$.subscribe(loading => {
      this.loading = loading;
    });
    
    if (this.googleService.isLoggedIn() || this.authService.isLoggedIn()) this.router.navigate(['/home'], { replaceUrl: true });
  }
}
