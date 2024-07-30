import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { SubmenuService } from '../submenu.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '@app/core/guards/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
  deleteEntityDialog: boolean = false;
  deleteEntitiesDialog: boolean = false;

  submenus!: any[];
  submenu = {} as any;
  selectedEntities: any[];
  
  cols: any[] = [];
  permissions: {};

  constructor(
    private subMenuService: SubmenuService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cols = [
      { field: 'menuName', header: 'Menu Name' },
      { field: 'subMenuName', header: 'Menu Name' },
      { field: 'description', header: 'Description' },
      { field: 'routerLink', header: 'Router Link' },
    ];
    this.permissions = this.authService.getPermissions(this.router.url);
  }

  confirmDelete(id?: number): void {
    const hdr = "Confirm"
    let msg = "Are you sure you want to delete this record?"

    if(!id && this.selectedEntities.length > 0) {
      msg = "Are you sure you want to delete these records?"
    }

    this.confirmationService.confirm({
      header: hdr,
      message: msg,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteEntity(id);
      },
      reject: () => {
      }
    });
  }

  deleteSelected() {
    this.deleteEntitiesDialog = true;
  }

  deleteEntity(id: number) {
    this.deleteEntityDialog = true;
    this.subMenuService.deleteSubMenu(id).subscribe({
      next: async () => {
        this.submenus = this.submenus.filter(c => c.subMenuId !== id);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The sub menu was successfully removed'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error deleting the sub menu'
        });
      },
      complete: () => {
        this.deleteEntityDialog = false;
      }
    });
  }

  async getSubMenus() {
    this.subMenuService.getSubMenus().subscribe({
      next: async (response: any) => {
        const {data} = response;
        this.submenus = data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error getting the sub menus'
        });
      }
    });    
  }

  ngOnInit() {
    this.getSubMenus();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
