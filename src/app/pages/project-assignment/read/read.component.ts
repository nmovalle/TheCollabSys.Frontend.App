import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ProjectAssignmentService } from '../project-assignment.service';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
})
export class ReadComponent {
  loading: boolean = false;
  projectId: number = 0;
  projectName: string = '';
  target: iRating[] = [];

  constructor(
    private messageService: MessageService,
    private projectAssignmentService: ProjectAssignmentService,
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
}