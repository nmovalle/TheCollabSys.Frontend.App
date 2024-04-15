import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { GoogleApiService } from '../core/guards/google-api.service';
import { Router } from '@angular/router';

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
        private router: Router) { }

    logout() {
        this.googleService.logout(); //aquí reemplazar por el logout pero del AuthService que se encargue de limpiar cache, tokens, etc y luego cierre google
        this.router.navigate(['/'], { replaceUrl: true });
    }
}
