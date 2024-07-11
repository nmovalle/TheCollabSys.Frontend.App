import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { EngineerService } from '@app/pages/engineers/engineer.service';
import { SkillService, UniqueIdsCategoriesDTO } from '@app/pages/skills/skill.service';
import { MessageService, TreeNode } from 'primeng/api';
import { EngineerSkillService } from '../engineer-skill.service';
import { forkJoin } from 'rxjs';
import { SkillCategoryService } from '@app/pages/skill-category/skill-category.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
})
export class AddComponent {
  loading: boolean = false;
  engineerId: number = 0;
  engineers: any[] = [];
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
    private skillsService: SkillService,
    private skillsCategoryService: SkillCategoryService,
    private engineersService: EngineerService,
    private engineersSkillService: EngineerSkillService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loading = true;
    forkJoin({
      engineers: this.engineersService.getEngineers(),
      skillsTree: this.skillsCategoryService.getSkillCategoriesTree()
    }).subscribe({
      next: ({ engineers, skillsTree }) => {
        const engineerData = engineers.data;
        this.skillsTree = skillsTree.data;

        engineerData.unshift({
          engineerId: 0,
          engineerName: 'Choose a engineer'
        });

        this.engineers = engineerData;
        this.engineerId = 0;

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

  async getEngineersSkills(event: any) {
    if (!this.originalSourceSkills || this.originalSourceSkills.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Skills have not been loaded yet.'
      });
      return;
    }

    this.loading = true;
    this.engineerId = event.value;
    this.engineersSkillService.getEngineerSkill(this.engineerId).subscribe({
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
          detail: 'There was an error getting the engineers skills'
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

  saveEngineer() {
    this.loading = true;
    const data = {
      engineerId: this.engineerId,
      skills: this.targetSkills
    };

    this.engineersSkillService.addEngineerSkill(data, null).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Record was successfully added.'
        });
        this.router.navigate(['/engineers/skills'], { replaceUrl: true });
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
}

interface iSkillRating {
  skillId: number;
  skillName: string;
  levelId: number;
}