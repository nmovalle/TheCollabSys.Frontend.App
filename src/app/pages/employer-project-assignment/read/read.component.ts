import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EmployerProjectAssignmentService } from '../employer-project-assignment.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrl: './read.component.scss'
})
export class ReadComponent implements OnInit {
  loading: boolean = false;
  employerId: number = 0;
  employerName: string = '';
  target: iRating[] = [];

  constructor(
    private messageService: MessageService,
    private employerProjectAssignmentService: EmployerProjectAssignmentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) {
        this.employerId = +id;
        this.getAssignments(this.employerId);
      }
    });
  }

  async getAssignments(employerId: number) {
    this.loading = true;
    this.employerProjectAssignmentService.getEmployerProjectAssignment(employerId).subscribe({
      next: (response: any) => {
        const { data } = response;
        if (data) {
          this.employerName = data.employerName;

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
          detail: 'There was an error getting the assignments'
        });
      }
    });
  }
}

interface iRating {
  projectId: number;
  projectName: string;
  clientId: number;
  clientName: string;
  numberPositionTobeFill: number;
  dateCreated: Date;
  startDate: Date;
  endDate: Date;
  dateAssigned: Date;
}