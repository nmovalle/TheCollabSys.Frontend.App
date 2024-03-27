import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from '../services/app.layout.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
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
        label: 'Employeers',
        items: [
            { label: 'Clents', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
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
    ]
  }
}
