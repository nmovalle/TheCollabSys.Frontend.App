import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SkillService } from '@app/pages/skills/skill.service';
import { MessageService } from 'primeng/api';
import { EngineerSkillService } from '../engineer-skill.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent {
  loading: boolean = false;
  engineerId: number = 0;
  engineerName: string = '';
  sourceSkills: iSkillRating[] = [];
  targetSkills: iSkillRating[] = [];
  originalSourceSkills: iSkillRating[] = [];

  constructor(
    private router: Router,
    private messageService: MessageService,
    private skillsService: SkillService,
    private engineersSkillService: EngineerSkillService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) {
        this.engineerId = +id;
      }
    });

    forkJoin({
      skills: this.skillsService.getSkills()
    }).subscribe({
      next: ({ skills }) => {
        const skillData: iSkillRating[] = skills.data;
        const updatedData = skillData.map((item: any) => ({ ...item, levelId: 5 }));
        this.originalSourceSkills = updatedData;
        this.sourceSkills = [...this.originalSourceSkills];

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
      },
      complete: () => {
        this.getEngineersSkills(this.engineerId);
      }
    });
  }

  async getEngineersSkills(engineerId: number) {
    if (!this.originalSourceSkills || this.originalSourceSkills.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Skills have not been loaded yet.'
      });
      return;
    }

    this.loading = true;
    this.engineersSkillService.getEngineerSkill(engineerId).subscribe({
      next: (response: any) => {
        this.targetSkills = [];
        this.sourceSkills = [...this.originalSourceSkills];

        const { data } = response;
        if (data) {
          this.engineerName = data.engineerName;

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

    this.engineersSkillService.updateEngineerSkill(this.engineerId, data, null).subscribe({
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