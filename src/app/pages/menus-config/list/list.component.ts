import { Component } from '@angular/core';
import { MenusConfigService } from '../menus-config.service';
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

  menusRoles!: any[];
  menuRole = {} as any;
  selectedEntities: any[];
  
  cols: any[] = [];
  permissions: {};

  constructor(
    private menuRoleService: MenusConfigService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cols = [
      { field: 'roleName', header: 'Role Name' },
      { field: 'subMenuName', header: 'Sub Menu Name' },
      { field: 'view', header: 'View' },
      { field: 'add', header: 'Add' },
      { field: 'edit', header: 'Edit' },
      { field: 'delete', header: 'Delete' },
      { field: 'export', header: 'Export' },
      { field: 'import', header: 'Import' }
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
    this.menuRoleService.deleteMenuRole(id).subscribe({
      next: async () => {
        this.menusRoles = this.menusRoles.filter(c => c.menuRoleId !== id);
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

  async getMenusRoles() {
    this.menuRoleService.getMenuRoles().subscribe({
      next: async (response: any) => {
        const {data} = response;
        this.menusRoles = data;
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
    this.getMenusRoles();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
