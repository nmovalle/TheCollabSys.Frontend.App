import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { ProjectService } from '../project.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '@app/core/guards/auth.service';
import { Router } from '@angular/router';
import { expandedRows } from '@app/pages/project-skill/list/list.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
  deleteProjectDialog: boolean = false;
  deleteProjectsDialog: boolean = false;

  projectsSkills!: any[];
  project = {} as any;
  selectedProjects: any[];
  
  cols: any[] = [];
  colsDetail: any[] = [];

  expandedRows: expandedRows = {};
  isExpanded: boolean = false;
  
  permissions: {};

  constructor(
    private projectService: ProjectService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cols = [
      { field: 'projectName', header: 'Name' },
      { field: 'clientName', header: 'Client Name' },
      { field: 'projectDescription', header: 'Project Description' },
      { field: 'numberPositionTobeFill', header: 'Number Position To Be Fill' },
      { field: 'startDate', header: 'Start Created' },
      { field: 'endDate', header: 'End Created' },
      { field: 'statusName', header: 'Status' },
    ];

    this.colsDetail = [
      { field: 'skillName', header: 'Skill Name' },
      { field: 'levelId', header: 'Level' },
    ]
    this.permissions = this.authService.getPermissions(this.router.url);
  }

  deleteSelectedProjects() {
    this.deleteProjectsDialog = true;
  }

  confirmDelete(id?: number): void {
    const hdr = "Confirm"
    let msg = "Are you sure you want to delete this record?"

    if(!id && this.selectedProjects.length > 0) {
      msg = "Are you sure you want to delete these records?"
    }

    this.confirmationService.confirm({
      header: hdr,
      message: msg,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteProject(id);
      },
      reject: () => {
      }
    });
  }

  deleteProject(id: number) {
    this.deleteProjectDialog = true;
    this.projectService.deleteProject(id).subscribe({
      next: async () => {
        this.projectsSkills = this.projectsSkills.filter(c => c.projectId !== id);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The project was successfully removed'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error deleting the project'
        });
      },
      complete: () => {
        this.deleteProjectDialog = false;
      }
    });
  }

  getProjects() {
    this.projectService.getProjectsDetail().subscribe({
      next: async (response: any) => {
        const {data} = response;
        this.projectsSkills = response.data;
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
    this.getProjects();
  }

  expandAll() {
    if (!this.isExpanded) {
        this.projectsSkills.forEach(p => p && p.projectId ? this.expandedRows[p.projectId] = true : '');

    } else {
        this.expandedRows = {};
    }
    this.isExpanded = !this.isExpanded;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
