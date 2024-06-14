import { Component } from '@angular/core';
import { EngineerSkillService } from '../engineer-skill.service';
import { ConfirmationService, MessageService } from 'primeng/api';
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
  deleteEngineerDialog: boolean = false;
  deleteEngineersDialog: boolean = false;

  engineersSkills!: any[];
  engineerSkill = {} as any;
  selectedEngineersSkills: any[];
  
  cols: any[] = [];
  colsDetail: any[] = [];
  expandedRows: expandedRows = {};
  isExpanded: boolean = false;

  constructor(
    private engineerSkillService: EngineerSkillService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.cols = [
      { field: 'engineerId', header: 'ID' },
      { field: 'engineerName', header: 'Name' }
    ];

    this.colsDetail = [
      { field: 'skillId', header: 'Skill Id' },
      { field: 'skillName', header: 'Skill Name' },
      { field: 'levelId', header: 'Level' },
    ]
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
        console.log("remove...")
        this.deleteEngineerSkill(id);
      },
      reject: () => {
        console.log("reject...")
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
        console.log(data)
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
