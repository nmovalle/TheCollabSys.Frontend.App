import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { AuthService } from '@app/core/guards/auth.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(
        private authService: AuthService
    ) { }

    ngOnInit() {
        const menu = this.authService.getUsermenu();
        const dahboard = {
            label: 'Home',
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/home'] }
            ]
        }

        this.model = [dahboard, ...menu];
    }
}
