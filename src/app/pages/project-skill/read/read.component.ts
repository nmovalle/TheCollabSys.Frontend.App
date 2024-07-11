import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ProjectSkillService } from '../project-skill.service';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html'
})
export class ReadComponent {
  loading: boolean = false;
  projectId: number = 0;
  projectName: string = '';
  targetSkills: iSkillRating[] = [];

  constructor(
    private messageService: MessageService,
    private projectSkillService: ProjectSkillService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) {
        this.projectId = +id;
        this.getProjectSkills(this.projectId);
      }
    });
  }

  async getProjectSkills(projectId: number) {
    this.loading = true;
    this.projectSkillService.getProjectSkill(projectId).subscribe({
      next: (response: any) => {
        const { data } = response;
        if (data) {
          this.projectName = data.projectName;

          const { skills } = data;
          this.targetSkills = skills;
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
}

interface iSkillRating {
  skillId: number;
  skillName: string;
  levelId: number;
}
