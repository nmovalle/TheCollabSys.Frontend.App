import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/home'] }
                ]
            },
            {
                label: 'Clients',
                items: [
                    { label: 'Clents', icon: 'pi pi-fw pi-id-card', routerLink: ['/clients'] },
                ]
            },
            {
                label: 'Employers',
                items: [
                    { label: 'Employers', icon: 'pi pi-fw pi-id-card', routerLink: ['/employers'] },
                ]
            },
            {
                label: 'Projects',
                items: [
                    { label: 'Projects', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                    { label: 'Projects Skills', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                ]
            },
            {
                label: 'Skills',
                items: [
                    { label: 'Skills', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                ]
            },
            {
                label: 'Employees',
                items: [
                    { label: 'Engineers', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                    { label: 'Engineers Skills', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                    { label: 'Engineers Activites', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                    { label: 'Engineers Daily Asignment', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                    { label: 'Engineers Equipment', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                    { label: 'Engineers Rating', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                ]
            },
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Landing',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['/landing']
                    },
                    {
                        label: 'Timeline',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink: ['/pages/timeline']
                    },
                    {
                        label: 'Not Found',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['/notfound']
                    },
                    {
                        label: 'Empty',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/pages/empty']
                    },
                ]
            },
        ];
    }
}
