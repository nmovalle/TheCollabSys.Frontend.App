import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EngineerSkillService } from '../engineer-skill.service';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
})
export class ReadComponent implements OnInit {
  loading: boolean = false;
  engineerId: number = 0;
  engineerName: string = '';
  targetSkills: iSkillRating[] = [];

  constructor(
    private messageService: MessageService,
    private engineersSkillService: EngineerSkillService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) {
        this.engineerId = +id;
        this.getEngineersSkills(this.engineerId);
      }
    });
  }

  async getEngineersSkills(engineerId: number) {
    this.loading = true;
    this.engineersSkillService.getEngineerSkill(engineerId).subscribe({
      next: (response: any) => {
        const { data } = response;
        if (data) {
          this.engineerName = data.engineerName;

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
          detail: 'There was an error getting the engineer skills'
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
