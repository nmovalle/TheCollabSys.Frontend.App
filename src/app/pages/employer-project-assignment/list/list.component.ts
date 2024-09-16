import { Component, OnInit } from '@angular/core';
import { EmployerProjectAssignmentService } from '../employer-project-assignment.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '@app/core/guards/auth.service';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';

interface expandedRows {
  [key: string]: boolean;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  deleteDialog: boolean = false;
  deletesDialog: boolean = false;

  assignments!: any[];
  assignment = {} as any;
  selectedAssignments: any[];
  
  cols: any[] = [];
  colsDetail: any[] = [];
  expandedRows: expandedRows = {};
  isExpanded: boolean = false;
  permissions: {};

  constructor(
    private employerProjectAssignmentService: EmployerProjectAssignmentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cols = [
      { field: 'employerName', header: 'Project' }
    ];

    this.colsDetail = [
      { field: 'projectName', header: 'Project Name' },
      { field: 'clientName', header: 'Client' },
      { field: 'projectDescription', header: 'Project Description' },
      { field: 'dateCreated', header: 'Created Date' },
      { field: 'startDate', header: 'Start Date' },
      { field: 'endDate', header: 'End Date' },
      { field: 'dateAssigned', header: 'Assigned Date' },
    ]

    this.permissions = this.authService.getPermissions(this.router.url);
  }

  confirmDelete(id?: number): void {
    const hdr = "Confirm"
    let msg = "Are you sure you want to delete this record?"

    if(!id && this.selectedAssignments.length > 0) {
      msg = "Are you sure you want to delete these records?"
    }

    this.confirmationService.confirm({
      header: hdr,
      message: msg,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteAssignment(id);
      },
      reject: () => {
      }
    });
  }

  deleteSelectedAssignments() {
    this.deletesDialog = true;
  }

  deleteAssignment(id: number) {
    this.deleteDialog = true;
    this.employerProjectAssignmentService.deleteEmployerProjectAssignment(id).subscribe({
      next: async () => {
        this.assignments = this.assignments.filter(c => c.employerId !== id);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The assignment was successfully removed'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error deleting the assignment'
        });
      },
      complete: () => {
        this.deleteDialog = false;
      }
    });
  }

  getAssignments() {
    this.employerProjectAssignmentService.getEmployerProjectAssignments().subscribe({
      next: async (response: any) => {
        const {data} = response;
        this.assignments = data;
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

  expandAll() {
    if (!this.isExpanded) {
        this.assignments.forEach(p => p && p.employerId ? this.expandedRows[p.employerId] = true : '');

    } else {
        this.expandedRows = {};
    }
    this.isExpanded = !this.isExpanded;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  ngOnInit() {
    this.getAssignments();
  }
}
