import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { GoogleApiService } from './services/google-api.service';
import { UserInfo } from './user-info';
import { Router } from '@angular/router';
import { LoadingService } from '@app/core/guards/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userInfo?: UserInfo;
  loading: boolean = false;

  constructor(
    private messageService: MessageService,
    private readonly googleService: GoogleApiService,
    private router: Router,
    private loadingService: LoadingService
  ) {
  }

  signInGoogle() {
    this.googleService.login();
  }

  ngOnInit() {
    this.loadingService.loading$.subscribe(loading => {
      this.loading = loading;
    });
    
    if (this.googleService.isLoggedIn()) this.router.navigate(['home'], { replaceUrl: true });
  }
}
