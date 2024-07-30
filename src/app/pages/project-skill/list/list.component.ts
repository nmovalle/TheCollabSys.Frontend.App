import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProjectSkillService } from '../project-skill.service';
import { AuthService } from '@app/core/guards/auth.service';
import { Router } from '@angular/router';

interface expandedRows {
  [key: string]: boolean;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  deleteProjectDialog: boolean = false;
  deleteProjectsDialog: boolean = false;

  projectsSkills!: any[];
  projectSkill = {} as any;
  selectedProjectsSkills: any[];
  
  cols: any[] = [];
  colsDetail: any[] = [];
  expandedRows: expandedRows = {};
  isExpanded: boolean = false;
  permissions: {};

  constructor(
    private projectSkillService: ProjectSkillService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cols = [
      { field: 'projectName', header: 'Name' }
    ];

    this.colsDetail = [
      { field: 'skillName', header: 'Skill Name' },
      { field: 'levelId', header: 'Level' },
    ]
    this.permissions = this.authService.getPermissions(this.router.url);
  }

  confirmDelete(id?: number): void {
    const hdr = "Confirm"
    let msg = "Are you sure you want to delete this record?"

    if(!id && this.selectedProjectsSkills.length > 0) {
      msg = "Are you sure you want to delete these records?"
    }

    this.confirmationService.confirm({
      header: hdr,
      message: msg,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteProjectSkill(id);
      },
      reject: () => {
      }
    });
  }

  deleteSelectedProjectsSkills() {
    this.deleteProjectsDialog = true;
  }

  deleteProjectSkill(id: number) {
    this.deleteProjectDialog = true;
    this.projectSkillService.deleteProjectSkill(id).subscribe({
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
    this.projectSkillService.getProjectSkills().subscribe({
      next: async (response: any) => {
        const {data} = response;
        this.projectsSkills = response.data;
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
