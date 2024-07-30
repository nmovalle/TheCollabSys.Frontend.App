import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EmployerProjectAssignmentService } from '../employer-project-assignment.service';
import { ProjectService } from '@app/pages/projects/project.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
  providers: [DatePipe]
})
export class EditComponent implements OnInit {
  loading: boolean = false;
  employerId: number = 0;
  employerName: string = '';
  dateAssigned: string = null;

  originalSource: iRating[] = [];
  source: iRating[] = [];
  target: iRating[] = [];

  display: boolean = false;
  collapsedTree: boolean = true;
  cols: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
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
          this.employerName = data.employerName;
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

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) {
        this.employerId = +id;
      }
    });

    if (this.employerId) await this.loadEmployerProjectAssignments(this.employerId);
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