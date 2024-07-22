import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/guards/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProjectAssignmentService } from '../project-assignment.service';
import { Table } from 'primeng/table';

interface expandedRows {
  [key: string]: boolean;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  deleteProjectAssignmentDialog: boolean = false;
  deleteProjectAssignmentsDialog: boolean = false;

  projectAssignments!: any[];
  projectAssignment = {} as any;
  selectedProjectAssignments: any[];
  
  cols: any[] = [];
  colsDetail: any[] = [];
  expandedRows: expandedRows = {};
  isExpanded: boolean = false;
  permissions: {};

  constructor(
    private projectAssignmentService: ProjectAssignmentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cols = [
      { field: 'projectName', header: 'Project' }
    ];

    this.colsDetail = [
      { field: 'engineerName', header: 'Engineer Name' },
      { field: 'firstName', header: 'First Name' },
      { field: 'lastName', header: 'Last Name' },
      { field: 'email', header: 'Email' },
      { field: 'phone', header: 'Phone' },
      // { field: 'image', header: 'Image' },
      // { field: 'rating', header: 'Rating' },
      { field: 'startDate', header: 'Start Date' },
      { field: 'endDate', header: 'End Date' },

    ]

    this.permissions = this.authService.getPermissions(this.router.url);
  }

  confirmDelete(id?: number): void {
    const hdr = "Confirm"
    let msg = "Are you sure you want to delete this record?"

    if(!id && this.selectedProjectAssignments.length > 0) {
      msg = "Are you sure you want to delete these records?"
    }

    this.confirmationService.confirm({
      header: hdr,
      message: msg,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteProjectAssignment(id);
      },
      reject: () => {
      }
    });
  }

  deleteSelectedProjectAssignments() {
    this.deleteProjectAssignmentsDialog = true;
  }

  deleteProjectAssignment(id: number) {
    this.deleteProjectAssignmentDialog = true;
    this.projectAssignmentService.deleteProjectAssignment(id).subscribe({
      next: async () => {
        this.projectAssignments = this.projectAssignments.filter(c => c.projectId !== id);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The project assignment was successfully removed'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error deleting the project assignment'
        });
      },
      complete: () => {
        this.deleteProjectAssignmentDialog = false;
      }
    });
  }

  getProjectAssignments() {
    this.projectAssignmentService.getProjectAssignments().subscribe({
      next: async (response: any) => {
        const {data} = response;
        this.projectAssignments = data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error getting the project assignments'
        });
      }
    });    
  }

  ngOnInit() {
    this.getProjectAssignments();
  }

  expandAll() {
    if (!this.isExpanded) {
        this.projectAssignments.forEach(p => p && p.projectId ? this.expandedRows[p.projectId] = true : '');

    } else {
        this.expandedRows = {};
    }
    this.isExpanded = !this.isExpanded;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
