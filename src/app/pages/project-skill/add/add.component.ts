import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { ProjectSkillService } from '../project-skill.service';
import { ProjectService } from '@app/pages/projects/project.service';
import { SkillService, UniqueIdsCategoriesDTO } from '@app/pages/skills/skill.service';
import { forkJoin } from 'rxjs';
import { SkillCategoryService } from '@app/pages/skill-category/skill-category.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  providers: [ConfirmationService]
})
export class AddComponent implements OnInit {
  loading: boolean = false;
  projectId: number = 0;
  projects: any[] = [];
  sourceSkills: iSkillRating[] = [];
  targetSkills: iSkillRating[] = [];
  originalSourceSkills: iSkillRating[] = [];

  display: boolean = false;
  collapsedTree: boolean = true;
  skillsTree: TreeNode[] = [];
  selectedTree: TreeNode[] = [];
  cols: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private projectSkillService: ProjectSkillService,
    private projectsService: ProjectService,
    private skillsService: SkillService,
    private skillsCategoryService: SkillCategoryService,
    private cdr: ChangeDetectorRef,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    forkJoin({
      projects: this.projectsService.getProjects(),
      skillsTree: this.skillsCategoryService.getSkillCategoriesTree()
    }).subscribe({
      next: ({ projects, skillsTree }) => {
        const projectData = projects.data;
        this.skillsTree = skillsTree.data;

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

    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'size', header: 'Size' },
      { field: 'type', header: 'Type' }
    ];
  }

  async getProjectSkills(event: any) {
    if (!this.originalSourceSkills || this.originalSourceSkills.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Skills have not been loaded yet.'
      });
      return;
    }

    this.loading = true;
    this.projectId = event.value;
    this.projectSkillService.getProjectSkill(this.projectId).subscribe({
      next: (response: any) => {
        this.targetSkills = [];
        this.sourceSkills = [...this.originalSourceSkills];

        const { data } = response;
        if (data) {
          const { skills } = data;
          this.targetSkills = skills;

          this.sourceSkills = this.sourceSkills.filter(skill =>
            !this.targetSkills.some(targetSkill => targetSkill.skillId === skill.skillId)
          );
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

  saveProject() {
    this.loading = true;
    const data = {
      projectId: this.projectId,
      skills: this.targetSkills
    };

    this.projectSkillService.addProjectSkill(data, null).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Record was successfully added.'
        });
        this.router.navigate(['/projects/skills'], { replaceUrl: true });
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


  loadSkills() {
    const uniqueIds = this.extractUniqueIds(this.selectedTree);
    const dto: UniqueIdsCategoriesDTO = {
      categoryIds: uniqueIds.categoryIds,
      subcategoryIds: uniqueIds.subcategoryIds
    };
    
    this.skillsService.getSkillsByCategories(dto).subscribe({
      next: (response: any) => {
        const skillData: iSkillRating[] = response.data;
        const updatedData = skillData.map((item: any) => ({ ...item, levelId: 5 }));
        this.originalSourceSkills = updatedData;
        this.sourceSkills = [...this.originalSourceSkills];
        this.sourceSkills = this.sourceSkills.filter(skill =>
          !this.targetSkills.some(targetSkill => targetSkill.skillId === skill.skillId)
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

interface iSkillRating {
  skillId: number;
  skillName: string;
  levelId: number;
}
