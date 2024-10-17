import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { UserService } from '../user.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '@app/core/guards/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
  deleteDialog: boolean = false;
  deletesDialog: boolean = false;

  users!: any[];
  user = {} as any;
  selectedUser: any[];
  
  cols: any[] = [];
  permissions: {};

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cols = [
      { field: 'userName', header: 'User Name' },
      { field: 'email', header: 'Email' },
    ];
    this.permissions = this.authService.getPermissions(this.router.url);
  }

  deleteSelectedUsers() {
    this.deletesDialog = true;
  }

  confirmDelete(id?: string): void {
    const hdr = "Confirm"
    let msg = "Are you sure you want to delete this record?"

    if(!id && this.selectedUser.length > 0) {
      msg = "Are you sure you want to delete these records?"
    }

    this.confirmationService.confirm({
      header: hdr,
      message: msg,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteUser(id);
      },
      reject: () => {
      }
    });
  }

  deleteUser(userId: string) {
  }

  async getUsers() {
    this.userService.getUsers().subscribe({
      next: async (response: any) => {
        const {data} = response;
        this.users = data;
      },
      error: async (err) => {
        const {error} = err;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error
        });
      }
    });    
  }

  ngOnInit() {
    this.getUsers();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
