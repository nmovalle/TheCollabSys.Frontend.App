import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SkillService, UniqueIdsCategoriesDTO } from '@app/pages/skills/skill.service';
import { MessageService, TreeNode } from 'primeng/api';
import { EngineerSkillService } from '../engineer-skill.service';
import { forkJoin } from 'rxjs';
import { SkillCategoryService } from '@app/pages/skill-category/skill-category.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {
  loading: boolean = false;
  engineerId: number = 0;
  engineerName: string = '';
  sourceSkills: iSkillRating[] = [];
  targetSkills: iSkillRating[] = [];
  originalSourceSkills: iSkillRating[] = [];

  display: boolean = false;
  collapsedTree: boolean = true;
  skillsTree: TreeNode[] = [];
  selectedTree: TreeNode[] = [];
  cols: any[] = [];

  constructor(
    private router: Router,
    private messageService: MessageService,
    private skillsService: SkillService,
    private engineersSkillService: EngineerSkillService,
    private skillsCategoryService: SkillCategoryService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) {
        this.engineerId = +id;
      }
    });

    const dto: UniqueIdsCategoriesDTO = {
      categoryIds: [1],
      subcategoryIds: [1]
    };
    forkJoin({
      skillsTree: this.skillsCategoryService.getSkillCategoriesTree(),
      skillsCategories: this.skillsService.getSkillsByCategories(dto),
    }).subscribe({
      next: ({ skillsTree, skillsCategories }) => {
        this.skillsTree = skillsTree.data;

        const skillData: iSkillRating[] = skillsCategories.data;
        const updatedData = skillData.map((item: any) => ({ ...item, levelId: 5 }));
        this.originalSourceSkills = updatedData;
        this.sourceSkills = [...this.originalSourceSkills];
        this.sourceSkills = this.sourceSkills.filter(skill =>
          !this.targetSkills.some(targetSkill => targetSkill.skillId === skill.skillId)
        );

        this.cdr.markForCheck();
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
      },
      complete: async () => {
        await this.getEngineersSkills(this.engineerId);
      }
    });
  }

  async getEngineersSkills(engineerId: number) {
    if (!this.originalSourceSkills || this.originalSourceSkills.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Skills have not been loaded yet.'
      });
      return;
    }

    this.loading = true;
    this.engineersSkillService.getEngineerSkill(engineerId).subscribe({
      next: (response: any) => {
        this.targetSkills = [];
        this.sourceSkills = [...this.originalSourceSkills];

        const { data } = response;
        if (data) {
          this.engineerName = data.engineerName;

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

  saveEngineer() {
    this.loading = true;
    const data = {
      engineerId: this.engineerId,
      skills: this.targetSkills
    };

    this.engineersSkillService.updateEngineerSkill(this.engineerId, data, null).subscribe({
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

  async loadSkills() {
    const uniqueIds = this.extractUniqueIds(this.selectedTree);
    const dto: UniqueIdsCategoriesDTO = {
      categoryIds: uniqueIds.categoryIds,
      subcategoryIds: uniqueIds.subcategoryIds
    };
    
    await this.fillSkills(dto);
  }

  async fillSkills(dto: UniqueIdsCategoriesDTO) {
    this.skillsService.getSkillsByCategories(dto).subscribe({
      next: async (response: any) => {
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