import { Component } from '@angular/core';
import { Table } from 'primeng/table';
import { SkillService } from '../skill.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class ListComponent {
  deleteSkillDialog: boolean = false;
  deleteSkillsDialog: boolean = false;

  skills!: any[];
  skill = {} as any;
  selectedSkills: any[];
  
  cols: any[] = [];

  constructor(
    private skillService: SkillService,
    private messageService: MessageService,
  ) {
    this.cols = [
      { field: 'skillId', header: 'ID' },
      { field: 'skillName', header: 'Name' },
      
    ];
  }

  deleteSelectedSkills() {
    this.deleteSkillsDialog = true;
  }

  deleteSkill(skillId: number) {
    this.deleteSkillDialog = true;
    this.skillService.deleteSkill(skillId).subscribe({
      next: () => {
        this.skills = this.skills.filter(c => c.skillId !== skillId);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The skill was successfully removed'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error deleting the skill'
        });
      },
      complete: () => {
        this.deleteSkillDialog = false;
      }
    });
  }

  getSkills() {
    this.skillService.getSkills().subscribe({
      next: async (response: any) => {
        const {data} = response;
        console.log(data)
        this.skills = response.data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error getting the skills'
        });
      }
    });    
  }

  ngOnInit() {
    this.getSkills();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
