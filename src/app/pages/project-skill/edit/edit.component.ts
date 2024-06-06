import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ProjectSkillService } from '../project-skill.service';
import { SkillService } from '@app/pages/skills/skill.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent {
  loading: boolean = false;
  projectId: number = 0;
  projectName: string = '';
  sourceSkills: iSkillRating[] = [];
  targetSkills: iSkillRating[] = [];
  originalSourceSkills: iSkillRating[] = [];

  constructor(
    private router: Router,
    private messageService: MessageService,
    private projectSkillService: ProjectSkillService,
    private skillsService: SkillService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) {
        this.projectId = +id;
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
        this.getProjectSkills(this.projectId);
      }
    });
  }

  async getProjectSkills(projectId: number) {
    if (!this.originalSourceSkills || this.originalSourceSkills.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Skills have not been loaded yet.'
      });
      return;
    }

    this.loading = true;
    this.projectSkillService.getProjectSkill(projectId).subscribe({
      next: (response: any) => {
        this.targetSkills = [];
        this.sourceSkills = [...this.originalSourceSkills];

        const { data } = response;
        if (data) {
          this.projectName = data.projectName;

          const { skills } = data;
          this.targetSkills = skills;

          // Filtrar sourceSkills eliminando los skills que ya están en targetSkills
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
          detail: 'There was an error getting the projects skills'
        });
      }
    });
  }

  saveProject() {
    this.loading = true;
    const data = {
      projectId: this.projectId,
      skills: this.targetSkills
    };

    this.projectSkillService.addProjectSkill(data, null).subscribe({
      next: (response: any) => {
        console.log(response);
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Record was successfully added.'
        });
        this.router.navigate(['/projects/skills'], { replaceUrl: true });
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