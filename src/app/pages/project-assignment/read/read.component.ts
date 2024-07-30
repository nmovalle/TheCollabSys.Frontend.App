import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ProjectAssignmentService } from '../project-assignment.service';
import { EngineerSkillService } from '@app/pages/engineer-skill/engineer-skill.service';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
})
export class ReadComponent implements OnInit {
  loading: boolean = false;
  projectId: number = 0;
  projectName: string = '';
  target: iRating[] = [];

  engineerDialog: boolean = false;
  engineerName: string = ''
  firstName: string = ''
  lastName: string = ''
  engineerSkills: iSkillRating[] = [];

  constructor(
    private messageService: MessageService,
    private projectAssignmentService: ProjectAssignmentService,
    private engineersSkillsService: EngineerSkillService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) {
        this.projectId = +id;
        this.getProjectAssignments(this.projectId);
      }
    });
  }

  async openEngineerDialog(engineerId: number): Promise<void> {
    await this.getEngineersSkills(engineerId);
    this.engineerDialog = true;
  }

  hideDialog() {
    this.engineerDialog = false;
  }

  async getEngineersSkills(engineerId: number){
    this.loading = true;
    this.engineersSkillsService.getEngineerSkill(engineerId).subscribe({
      next: (response: any) => {        
        const { data } = response;
        const { engineerName, firstName, lastName, skills } = data;

        this.engineerName = engineerName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.engineerSkills = skills;

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

  async getProjectAssignments(projectId: number) {
    this.loading = true;
    this.projectAssignmentService.getProjectAssignment(projectId).subscribe({
      next: (response: any) => {
        const { data } = response;
        if (data) {
          this.projectName = data.projectName;

          const { assignments } = data;
          this.target = assignments;
        }

        this.loading = false;
      },
      error: (ex) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error getting the projects assignments'
        });
      }
    });
  }
}

interface iRating {
  engineerId: number;
  engineerName: string;
  firstName: string;
  lastName: string;
  startDate: Date;
  endDate: Date;
  rating: number
}

interface iSkillRating {
  skillId: number;
  skillName: string;
  levelId: number;
}