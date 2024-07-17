import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '@app/pages/projects/project.service';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { ProjectAssignmentService } from '../project-assignment.service';
import { EngineerService } from '@app/pages/engineers/engineer.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent {
  loading: boolean = false;
  projectId: number = 0;
  projects: any[] = [];

  sourceEngineers: iRating[] = [];
  targetEngineers: iRating[] = [];
  originalSource: iRating[] = [];

  display: boolean = false;
  collapsedTree: boolean = true;
  skillsTree: TreeNode[] = [];
  selectedTree: TreeNode[] = [];
  cols: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private projectsService: ProjectService, //projects catalog
    private engineersService: EngineerService, //engineers catalog
    
    // private skillsService: SkillService,
    // private skillsCategoryService: SkillCategoryService, //tree
    
    private projectAssignmentService: ProjectAssignmentService,
    private cdr: ChangeDetectorRef,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    forkJoin({
      projects: this.projectsService.getProjects(),
    }).subscribe({
        next: ({ projects }) => {
        const projectData = projects.data;

        projectData.unshift({
          projectId: 0,
          projectName: 'Choose a project'
        });

        this.projects = projectData;
        this.projectId = 0;

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

  async loadProjectAssignments(projectId: number) {
    await this.loadAssignments(projectId);
    await this.getProjectAssignments(projectId);
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

    this.projectAssignmentService.addProjectAssignment(data, null).subscribe({
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

  extractUniqueIds(dataArray) {
    const uniqueCategories = new Set<number>();
    const uniqueSubcategories = new Set<number>();

    dataArray.forEach(item => {
        const mainData = item.data.split(', ').reduce((acc, pair) => {
            const [key, value] = pair.split(': ');
            acc[key] = parseInt(value, 10);
            return acc;
        }, {});

        if (mainData.categoryId) {
            uniqueCategories.add(mainData.categoryId);
        }

        if (mainData.subcategoryId) {
            uniqueSubcategories.add(mainData.subcategoryId);
        }

        if (item.children && Array.isArray(item.children)) {
            item.children.forEach(child => {
                const childData = child.data.split(', ').reduce((acc, pair) => {
                    const [key, value] = pair.split(': ');
                    acc[key] = parseInt(value, 10);
                    return acc;
                }, {});

                if (childData.categoryId) {
                    uniqueCategories.add(childData.categoryId);
                }

                if (childData.subcategoryId) {
                    uniqueSubcategories.add(childData.subcategoryId);
                }
            });
        }
    });

    return {
        categoryIds: Array.from(uniqueCategories),
        subcategoryIds: Array.from(uniqueSubcategories)
    };
  }


  async loadAssignments(projectId: number) {
    this.engineersService.getEngineersByProject(projectId).subscribe({
      next: async (response: any) => {
        const assignmentsData: iRating[] = response.data;
        const updatedData = assignmentsData.map((item: any) => ({ ...item, rating: 5, startDate: '', endDate: '' }));
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
}

interface iRating {
  engineerId: number;
  engineerName: string;
  firstName: string;
  lastName: string;
  startDate: Date;
  endDate: Date;
}
