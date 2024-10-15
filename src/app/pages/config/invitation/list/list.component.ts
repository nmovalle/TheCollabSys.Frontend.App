import { Component } from '@angular/core';
import { InvitationService } from '../invitation.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '@app/core/guards/auth.service';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  deleteDialog: boolean = false;
  deletesDialog: boolean = false;

  invitations!: any[];
  invitation = {} as any;
  selectedInvitations: any[];
  
  cols: any[] = [];
  permissions: {};

  constructor(
    private invitationService: InvitationService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cols = [
      { field: 'email', header: 'Email' },
      { field: 'token', header: 'Token' },
      { field: 'expirationDate', header: 'Expiration Date' },
      { field: 'status', header: 'Status' },
      { field: 'roleName', header: 'Role' },
      { field: 'isExternal', header: 'Is External' },
      { field: 'isBlackList', header: 'Is Black List' },
    ];
    this.permissions = this.authService.getPermissions(this.router.url);
  }

  deleteSelectedInvitations() {
    this.deletesDialog = true;
  }

  confirmDelete(id?: number): void {
    const hdr = "Confirm"
    let msg = "Are you sure you want to delete this record?"

    if(!id && this.selectedInvitations.length > 0) {
      msg = "Are you sure you want to delete these records?"
    }

    this.confirmationService.confirm({
      header: hdr,
      message: msg,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteInvitation(id);
      },
      reject: () => {
      }
    });
  }

  deleteInvitation(invitationId: number) {
    this.deleteDialog = true;
    this.invitationService.deleteInvitation(invitationId).subscribe({
      next: async () => {
        this.invitations = this.invitations.filter(c => c.id !== invitationId);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The invitation was successfully removed'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error deleting the invitation'
        });
      },
      complete: () => {
        this.deleteDialog = false;
      }
    });
  }

  getInvitations() {
    this.invitationService.getInvitations().subscribe({
      next: (response: any) => {
        const {data} = response;
        this.invitations = response.data;
      },
      error: (ex) => {
        const {error} = ex;
        this.messageService.add({
          severity: 'info',
          summary: 'Not Found',
          detail: error.message
        });
      }
    });
  }

  ngOnInit() {
    this.getInvitations();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
