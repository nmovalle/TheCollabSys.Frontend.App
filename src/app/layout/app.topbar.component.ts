import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { GoogleApiService } from '../core/guards/google-api.service';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/guards/auth.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {
    items!: MenuItem[];
    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public layoutService: LayoutService, 
        public googleService: GoogleApiService,
        private authService: AuthService,
        private router: Router
    ) { }

    logout() {        
        const authProvider = this.authService.getAuthProvider();
        switch (authProvider) {
          case "Google":
            this.googleService.logout();
            break;
          default:
            break;
        }

        this.authService.logout();
        this.router.navigate(['/'], { replaceUrl: true });
    }
}
