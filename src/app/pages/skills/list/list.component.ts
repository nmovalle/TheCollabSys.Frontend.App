import { Component } from '@angular/core';
import { Table } from 'primeng/table';
import { SkillService } from '../skill.service';
import { ConfirmationService, MessageService } from 'primeng/api';

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
    private confirmationService: ConfirmationService
  ) {
    this.cols = [
      { field: 'skillName', header: 'Name' },
      { field: 'categoryName', header: 'Category Name' },
      { field: 'subcategoryName', header: 'Subcategory Name' },
    ];
  }

  deleteSelectedSkills() {
    this.deleteSkillsDialog = true;
  }

  confirmDelete(id?: number): void {
    const hdr = "Confirm"
    let msg = "Are you sure you want to delete this record?"

    if(!id && this.selectedSkills.length > 0) {
      msg = "Are you sure you want to delete these records?"
    }

    this.confirmationService.confirm({
      header: hdr,
      message: msg,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log("remove...")
        this.deleteSkill(id);
      },
      reject: () => {
        console.log("reject...")
      }
    });
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
