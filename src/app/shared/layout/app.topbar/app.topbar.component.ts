import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../services/app.layout.service';
import { GoogleApiService } from '@app/core/services/google-api.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
})
export class AppTopbarComponent implements OnInit {
  items!: MenuItem[];

  @ViewChild('menubutton') menuButton!: ElementRef;
  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
  @ViewChild('topbarmenu') menu!: ElementRef;

  constructor(
    public layoutService: LayoutService,
    private readonly googleApi: GoogleApiService,
    private router: Router
    ) {
  }

  ngOnInit() {
    console.log(this.googleApi.isLoggedIn())

  }

  signOut() {
    debugger;

    if (this.googleApi.isLoggedIn()) {
    this.googleApi.signOut();
    }
    this.router.navigate(['/']);
  }
}
