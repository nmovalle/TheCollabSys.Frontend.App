import { Component } from '@angular/core';
import { EngineerService } from '../engineer.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from '@app/core/guards/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class ListComponent {
  deleteEngineerDialog: boolean = false;
  deleteEngineersDialog: boolean = false;

  engineers!: any[];
  engineer = {} as any;
  selectedEngineers: any[];
  
  cols: any[] = [];
  permissions: {};

  constructor(
    private engineerService: EngineerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cols = [
      { field: 'engineerName', header: 'Name' },
      { field: 'firstName', header: 'First Name' },
      { field: 'lastName', header: 'Last Name' },
      { field: 'phone', header: 'Phone' },
      { field: 'employerName', header: 'Employer Name' },
      { field: 'email', header: 'Email' },
      { field: 'dateCreated', header: 'Date Created' },
      { field: 'dateUpdate', header: 'Date Updated' },
      { field: 'isActive', header: 'Active' },
    ];
    this.permissions = this.authService.getPermissions(this.router.url);
  }

  deleteSelectedEngineers() {
    this.deleteEngineersDialog = true;
  }

  confirmDelete(id?: number): void {
    const hdr = "Confirm"
    let msg = "Are you sure you want to delete this record?"

    if(!id && this.selectedEngineers.length > 0) {
      msg = "Are you sure you want to delete these records?"
    }

    this.confirmationService.confirm({
      header: hdr,
      message: msg,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteEngineer(id);
      },
      reject: () => {
      }
    });
  }

  deleteEngineer(engineerId: number) {
    this.deleteEngineerDialog = true;
    this.engineerService.deleteEngineer(engineerId).subscribe({
      next: async () => {
        this.engineers = this.engineers.filter(c => c.engineerId !== engineerId);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The engineer was successfully removed'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error deleting the engineer'
        });
      },
      complete: () => {
        this.deleteEngineerDialog = false;
      }
    });
  }

  getEngineers() {
    this.engineerService.getEngineers().subscribe({
      next: (response: any) => {
        const {data} = response;
        this.engineers = response.data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error getting the engineers'
        });
      }
    });    
  }

  ngOnInit() {
    this.getEngineers();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
