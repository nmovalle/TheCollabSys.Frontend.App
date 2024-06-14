import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { EngineerService } from '@app/pages/engineers/engineer.service';
import { SkillService } from '@app/pages/skills/skill.service';
import { MessageService } from 'primeng/api';
import { EngineerSkillService } from '../engineer-skill.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
})
export class AddComponent {
  loading: boolean = false;
  engineerId: number = 0;
  engineers: any[] = [];
  sourceSkills: iSkillRating[] = [];
  targetSkills: iSkillRating[] = [];
  originalSourceSkills: iSkillRating[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private skillsService: SkillService,
    private engineersService: EngineerService,
    private engineersSkillService: EngineerSkillService,
    
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loading = true;
    forkJoin({
      engineers: this.engineersService.getEngineers(),
      skills: this.skillsService.getSkills()
    }).subscribe({
      next: ({ engineers, skills }) => {
        const engineerData = engineers.data;

        engineerData.unshift({
          engineerId: 0,
          engineerName: 'Choose a engineer'
        });

        this.engineers = engineerData;

        const skillData: iSkillRating[] = skills.data;
        const updatedData = skillData.map((item: any) => ({ ...item, levelId: 5 }));
        this.originalSourceSkills = updatedData;
        this.sourceSkills = [...this.originalSourceSkills];

        this.engineerId = 0;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error loading data'
        });
      }
    });
  }

  async getEngineersSkills(event: any) {
    if (!this.originalSourceSkills || this.originalSourceSkills.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Skills have not been loaded yet.'
      });
      return;
    }

    this.loading = true;
    this.engineerId = event.value;
    this.engineersSkillService.getEngineerSkill(this.engineerId).subscribe({
      next: (response: any) => {
        this.targetSkills = [];
        this.sourceSkills = [...this.originalSourceSkills];

        const { data } = response;
        if (data) {
          const { skills } = data;
          this.targetSkills = skills;
          this.sourceSkills = this.sourceSkills.filter(skill =>
            !this.targetSkills.some(targetSkill => targetSkill.skillId === skill.skillId)
          );
        }

        this.loading = false;
      },
      error: (ex) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error getting the engineers skills'
        });
      }
    });
  }

  saveEngineer() {
    this.loading = true;
    const data = {
      engineerId: this.engineerId,
      skills: this.targetSkills
    };

    this.engineersSkillService.addEngineerSkill(data, null).subscribe({
      next: (response: any) => {
        console.log(response);
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Record was successfully added.'
        });
        this.router.navigate(['/engineers/skills'], { replaceUrl: true });
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while adding the record.'
        });
      }
    });
  }
}

interface iSkillRating {
  skillId: number;
  skillName: string;
  levelId: number;
}