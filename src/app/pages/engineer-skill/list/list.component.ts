import { Component, OnInit } from '@angular/core';
import { EngineerSkillService } from '../engineer-skill.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
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
  deleteEngineerDialog: boolean = false;
  deleteEngineersDialog: boolean = false;

  engineersSkills!: any[];
  engineerSkill = {} as any;
  selectedEngineersSkills: any[];
  
  cols: any[] = [];
  colsDetail: any[] = [];
  expandedRows: expandedRows = {};
  isExpanded: boolean = false;
  permissions: {};

  constructor(
    private engineerSkillService: EngineerSkillService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cols = [
      { field: 'engineerName', header: 'Name' },
      { field: 'firstName', header: 'First Name' },
      { field: 'lastName', header: 'Last Name' }
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

    if(!id && this.selectedEngineersSkills.length > 0) {
      msg = "Are you sure you want to delete these records?"
    }

    this.confirmationService.confirm({
      header: hdr,
      message: msg,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteEngineerSkill(id);
      },
      reject: () => {
      }
    });
  }

  deleteSelectedEngineersSkills() {
    this.deleteEngineersDialog = true;
  }

  deleteEngineerSkill(id: number) {
    this.deleteEngineerDialog = true;
    this.engineerSkillService.deleteEngineerSkill(id).subscribe({
      next: async () => {
        this.engineersSkills = this.engineersSkills.filter(c => c.engineerId !== id);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The engineer skill was successfully removed'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error deleting the engineer skill'
        });
      },
      complete: () => {
        this.deleteEngineerDialog = false;
      }
    });
  }

  getEngineers() {
    this.engineerSkillService.getEngineerSkills().subscribe({
      next: async (response: any) => {
        const {data} = response;
        this.engineersSkills = response.data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error getting the engineers skills'
        });
      }
    });    
  }

  ngOnInit() {
    this.getEngineers();
  }

  expandAll() {
    if (!this.isExpanded) {
        this.engineersSkills.forEach(p => p && p.engineerId ? this.expandedRows[p.engineerId] = true : '');

    } else {
        this.expandedRows = {};
    }
    this.isExpanded = !this.isExpanded;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
