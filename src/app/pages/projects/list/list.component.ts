import { Component } from '@angular/core';
import { Table } from 'primeng/table';
import { ProjectService } from '../project.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class ListComponent {
  deleteProjectDialog: boolean = false;
  deleteProjectsDialog: boolean = false;

  projects!: any[];
  project = {} as any;
  selectedProjects: any[];
  
  cols: any[] = [];

  constructor(
    private projectService: ProjectService,
    private messageService: MessageService,
  ) {
    this.cols = [
      { field: 'projectId', header: 'ID' },
      { field: 'projectName', header: 'Name' },
      { field: 'clientName', header: 'Client Name' },
      { field: 'projectDescription', header: 'Project Description' },
      { field: 'numberPositionTobeFill', header: 'Number Position To Be Fill' },
      { field: 'startDate', header: 'Start Created' },
      { field: 'endDate', header: 'End Created' },
      { field: 'statusId', header: 'Status' },
    ];
  }

  deleteSelectedProjects() {
    this.deleteProjectsDialog = true;
  }

  deleteProject(id: number) {
    this.deleteProjectDialog = true;
    this.projectService.deleteProject(id).subscribe({
      next: async () => {
        this.projects = this.projects.filter(c => c.projectId !== id);
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
    this.projectService.getProjects().subscribe({
      next: async (response: any) => {
        const {data} = response;
        console.log(data)
        this.projects = response.data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error getting the projects'
        });
      }
    });    
  }

  ngOnInit() {
    this.getProjects();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
