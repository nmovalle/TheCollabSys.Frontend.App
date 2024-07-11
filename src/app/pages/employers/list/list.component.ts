import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EmployerService } from '../employer.service';
import { Table } from 'primeng/table';
import { AuthService } from '@app/core/guards/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class ListComponent {
  deleteEmployerDialog: boolean = false;
  deleteEmployersDialog: boolean = false;

  employers!: any[];
  employer = {} as any;
  selectedEmployers: any[];
  
  cols: any[] = [];
  permissions: {};

  constructor(
    private employerService: EmployerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cols = [
      { field: 'employerName', header: 'Name' },
      { field: 'address', header: 'Address' },
      { field: 'phone', header: 'Phone' },
      { field: 'dateCreated', header: 'Date Created' },
      { field: 'dateUpdate', header: 'Date Updated' },
      { field: 'active', header: 'Active' },
    ];
    this.permissions = this.authService.getPermissions(this.router.url);
  }

  deleteSelectedEmployers() {
    this.deleteEmployersDialog = true;
  }

  confirmDelete(id?: number): void {
    const hdr = "Confirm"
    let msg = "Are you sure you want to delete this record?"

    if(!id && this.selectedEmployers.length > 0) {
      msg = "Are you sure you want to delete these records?"
    }

    this.confirmationService.confirm({
      header: hdr,
      message: msg,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteEmployer(id);
      },
      reject: () => {
      }
    });
  }

  deleteEmployer(employerId: number) {
    this.deleteEmployerDialog = true;
    this.employerService.deleteEmployer(employerId).subscribe({
      next: async () => {
        this.employers = this.employers.filter(c => c.employerId !== employerId);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The employer was successfully removed'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error deleting the employer'
        });
      },
      complete: () => {
        this.deleteEmployerDialog = false;
      }
    });
  }

  getEmployers() {
    this.employerService.getEmployers().subscribe({
      next: (response: any) => {
        const {data} = response;
        this.employers = response.data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error getting the employer'
        });
      }
    });    
  }

  ngOnInit() {
    this.getEmployers();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
