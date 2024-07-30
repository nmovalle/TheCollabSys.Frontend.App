import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployerService } from '@app/pages/employers/employer.service';
import { ProjectService } from '@app/pages/projects/project.service';
import { MessageService } from 'primeng/api';
import { EmployerProjectAssignmentService } from '../employer-project-assignment.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
  providers: [DatePipe]
})
export class AddComponent implements OnInit {
  loading: boolean = false;
  employerId: number = 0;
  dateAssigned: string = null;

  employers: any[] = [];
  projects: any[] = [];

  originalSource: iRating[] = [];
  source: iRating[] = [];
  target: iRating[] = [];
  
  display: boolean = false;
  collapsedTree: boolean = true;
  cols: any[] = [];

  constructor(
    private router: Router,
    private messageService: MessageService,
    private employersService: EmployerService, //employers catalog
    private projectsService: ProjectService, //projects catalog
    private employerProjectAssignmentService: EmployerProjectAssignmentService,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe
  ) {}

  async availableAssignments() {
    this.projectsService.getProjects().subscribe({
      next: async (response: any) => {
        const assignmentsData: iRating[] = response.data;
        const updatedData = assignmentsData.map((item: any) => ({ ...item, dateAssigned: this.dateAssigned }));
        this.originalSource = updatedData;
        this.source = [...this.originalSource];
        this.source = this.source.filter(e =>
          !this.target.some(t => t.projectId === e.projectId)
        );

        this.collapsedTree = false;
        this.loading = false;
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

  async getEmployerProjectAssignments(employerId: number) {
    this.loading = true;
    this.employerId = employerId
    this.employerProjectAssignmentService.getEmployerProjectAssignment(this.employerId).subscribe({
      next: (response: any) => {
        this.target = [];
        this.source = [...this.originalSource];

        const { data } = response;
        if (data) {
          const { assignments } = data;
          this.target = assignments.map(assignment => ({
            ...assignment,
            dateCreated: this.datePipe.transform(assignment.dateCreated, 'MM/dd/yyyy'),
            startDate: this.datePipe.transform(assignment.startDate, 'MM/dd/yyyy'),
            endDate: this.datePipe.transform(assignment.endDate, 'MM/dd/yyyy'),
            dateAssigned: this.datePipe.transform(assignment.dateAssigned, 'MM/dd/yyyy')
          }));

          this.source = this.source.filter(e =>
            !this.target.some(t => t.projectId === e.projectId)
          );
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

    //drop down employer event
  async loadEmployerProjectAssignments(employerId: number) {
    await this.availableAssignments();
    await this.getEmployerProjectAssignments(employerId);
  }

  save() {
    this.loading = true;
    const data = {
      employerId: this.employerId,
      assignments: this.target
    };

    this.employerProjectAssignmentService.addEmployerProjectAssignment(data, null).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Record was successfully added.'
        });
        this.router.navigate(['/employers/assignments'], { replaceUrl: true });
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

  ngOnInit(): void {
    this.loading = true;

    forkJoin({
      employers: this.employersService.getEmployers(),
    }).subscribe({
        next: ({ employers }) => {
        const employerData = employers.data;

        employerData.unshift({
          employerId: 0,
          employerName: 'Choose an employer'
        });

        this.employers = employerData;
        this.employerId = 0;

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
