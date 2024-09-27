import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ProjectService } from '../project.service';
import { ProjectSkillService } from '@app/pages/project-skill/project-skill.service';
import { iSkillRating } from '@app/core/components/skills/skills.component';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
})
export class ReadComponent implements OnInit {
  loading: boolean = false;
  id: number | null = null;
  dataForm!: FormGroup;

  targetSkills: iSkillRating[] = [];
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private projectService: ProjectService,
    private projectSkillService: ProjectSkillService,
  ) {
  }

  getProject(id: number) {
    this.projectService.getProject(this.id).subscribe({
      next: async (response: any) => {
        if (response) {
          const { status, data, message } = response;
          if (status == 'success') {
            data.startDate = data.startDate ? new Date(data.startDate) : null;
            data.endDate = data.endDate ? new Date(data.endDate) : null;
            this.dataForm.patchValue(data);
            this.loading = false;
          }
          if (status == 'error') {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: message
            });
          }
        } else {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while getting the project.'
          });
        }
      },
      error: (err) => {
        const {error} = err;
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error
        });
      }
    });
  }

  async getProjectSkills(projectId: number) {
    this.loading = true;
    this.projectSkillService.getProjectSkill(projectId).subscribe({
      next: (response: any) => {
        const { data } = response;
        if (data) {

          const { skills } = data;
          this.targetSkills = skills;
        }

        this.loading = false;
      },
      error: (err) => {
        const {error} = err;
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error
        });
      }
    });
  }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      folio: [null],
      projectId: [0],
      projectName: [null],
      clientId: [null],
      clientName: [null],
      projectDescription: [null],
      numberPositionTobeFill: [null],
      startDate: [null],
      endDate: [null],
      statusId: [null],
      statusName: [null],
      dateCreated: [null],
      dateUpdate: [null],
      userId: [null]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) {
        this.id = +id;
        this.getProject(this.id);
        this.getProjectSkills(this.id);
      }
    });
  }
}
