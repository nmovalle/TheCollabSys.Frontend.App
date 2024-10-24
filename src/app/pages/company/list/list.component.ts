import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../company.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '@app/core/guards/auth.service';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  deleteDialog: boolean = false;
  deletesDialog: boolean = false;

  companies!: any[];
  company = {} as any;
  selectedCompanies: any[];
  
  cols: any[] = [];
  
  permissions: {};

  constructor(
    private companyService: CompanyService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cols = [
      { field: 'fullName', header: 'Full Name' },
      { field: 'address', header: 'Address' },
      { field: 'zipcode', header: 'Zip Code' },
      { field: 'phone', header: 'Phone' },
      { field: 'active', header: 'Active' },
    ];

    this.permissions = this.authService.getPermissions(this.router.url);
  }

  deleteSelectedCompanies() {
    this.deletesDialog = true;
  }

  confirmDelete(id?: number): void {
    const hdr = "Confirm"
    let msg = "Are you sure you want to delete this record?"

    if(!id && this.selectedCompanies.length > 0) {
      msg = "Are you sure you want to delete these records?"
    }

    this.confirmationService.confirm({
      header: hdr,
      message: msg,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteCompany(id);
      },
      reject: () => {
      }
    });
  }

  deleteCompany(id: number) {
    this.deleteDialog = true;
    this.companyService.deleteComany(id).subscribe({
      next: async () => {
        this.companies = this.companies.filter(c => c.engineerId !== id);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The company was successfully removed'
        });
      },
      error: (err) => {
        const {error} = err;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error
        });
      },
      complete: () => {
        this.deleteDialog = false;
      }
    });
  }

  getCompanies() {
    const { companyId } = this.authService.getUserCompany();
    this.companyService.getCompanies(companyId).subscribe({
      next: (response: any) => {
        const {data} = response;
        this.companies = data;
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
    this.getCompanies();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
