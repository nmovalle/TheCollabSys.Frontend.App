import { Component } from '@angular/core';
import { MenuService } from '../menu.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '@app/core/guards/auth.service';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class ListComponent {
  deleteEntityDialog: boolean = false;
  deleteEntitiesDialog: boolean = false;

  menus!: any[];
  menu = {} as any;
  selectedEntities: any[];
  
  cols: any[] = [];
  permissions: {};

  constructor(
    private menuService: MenuService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cols = [
      { field: 'menuName', header: 'Menu Name' },
      { field: 'description', header: 'Description' },
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
    this.menuService.deleteMenu(id).subscribe({
      next: async () => {
        this.menus = this.menus.filter(c => c.menuId !== id);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The menu was successfully removed'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error deleting the menu'
        });
      },
      complete: () => {
        this.deleteEntityDialog = false;
      }
    });
  }

  async getMenus() {
    this.menuService.getMenus().subscribe({
      next: async (response: any) => {
        const {data} = response;
        this.menus = data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error getting the menus'
        });
      }
    });    
  }

  ngOnInit() {
    this.getMenus();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
