import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EngineerService } from '@app/pages/engineers/engineer.service';
import { MessageService } from 'primeng/api';
import { ProjectAssignmentService } from '../project-assignment.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent {
  loading: boolean = false;
  projectId: number = 0;
  projectName: string = '';

  sourceEngineers: iRating[] = [];
  targetEngineers: iRating[] = [];
  originalSource: iRating[] = [];

  display: boolean = false;
  collapsedTree: boolean = true;
  cols: any[] = [];

  constructor(
    private router: Router,
    private messageService: MessageService,
    private engineersService: EngineerService,
    private projectAssignmentService: ProjectAssignmentService,
    private route: ActivatedRoute
  ) {}

  async loadProjectAssignments(projectId: number) {
    await this.loadAssignments(projectId);
    await this.getProjectAssignments(projectId);
  }

  async loadAssignments(projectId: number) {
    this.engineersService.getEngineersByProject(projectId).subscribe({
      next: async (response: any) => {
        const assignmentsData: iRating[] = response.data;
        const updatedData = assignmentsData.map((item: any) => ({ ...item, startDate: '', endDate: '' }));
        this.originalSource = updatedData;
        this.sourceEngineers = [...this.originalSource];
        this.sourceEngineers = this.sourceEngineers.filter(e =>
          !this.targetEngineers.some(t => t.engineerId === e.engineerId)
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

  async getProjectAssignments(projectId: number) {
    this.loading = true;
    this.projectId = projectId
    this.projectAssignmentService.getProjectAssignment(this.projectId).subscribe({
      next: (response: any) => {        
        this.targetEngineers = [];
        this.sourceEngineers = [...this.originalSource];

        const { data } = response;
        if (data) {
          this.projectName = data.projectName;
          const { assignments } = data;
          this.targetEngineers = assignments;

          this.sourceEngineers = this.sourceEngineers.filter(e =>
            !this.targetEngineers.some(t => t.engineerId === e.engineerId)
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

  saveProject() {
    this.loading = true;
    const data = {
      projectId: this.projectId,
      assignments: this.targetEngineers
    };

    this.projectAssignmentService.updateProjectAssignment(this.projectId, data, null).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Record was successfully added.'
        });
        this.router.navigate(['/projects/assignments'], { replaceUrl: true });
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
        this.projectId = +id;
      }
    });

    if (this.projectId) await this.loadProjectAssignments(this.projectId);
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