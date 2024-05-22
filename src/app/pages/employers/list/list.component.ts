import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EmployerService } from '../employer.service';
import { Table } from 'primeng/table';

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

  constructor(
    private employerService: EmployerService,
    private messageService: MessageService,
  ) {
    this.cols = [
      { field: 'employerId', header: 'ID' },
      { field: 'employerName', header: 'Name' },
      { field: 'address', header: 'Address' },
      { field: 'phone', header: 'Phone' },
      { field: 'dateCreated', header: 'Date Created' },
      { field: 'dateUpdate', header: 'Date Updated' },
      { field: 'active', header: 'Active' },
    ];
  }

  deleteSelectedEmployers() {
    this.deleteEmployersDialog = true;
  }

  deleteEmployer(employerId: number) {
    this.deleteEmployerDialog = true;
    this.employerService.deleteEmployer(employerId).subscribe({
      next: () => {
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
        console.log(data)
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
