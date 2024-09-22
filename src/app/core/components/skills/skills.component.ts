import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingService } from '@app/core/guards/loading.service';
import { PrimengModule } from '@app/core/modules/primeng.module';
import { SkillCategoryService } from '@app/pages/skill-category/skill-category.service';
import { SkillService, UniqueIdsCategoriesDTO } from '@app/pages/skills/skill.service';
import { MessageService, TreeNode } from 'primeng/api';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PrimengModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent implements OnInit, OnChanges {
  @Input() isDialog: boolean = false;
  @Input() parentSkills: iSkillRating[] = [];

  @Output() onSkillsCreated: EventEmitter<iSkillRating[]> = new EventEmitter();
  @Output() onClose: EventEmitter<void> = new EventEmitter();

  display: boolean = false;

  collapsedTree: boolean = true;
  skillsTree: TreeNode[] = [];
  selectedTree: TreeNode[] = [];

  sourceSkills: iSkillRating[] = [];
  targetSkills: iSkillRating[] = [];
  originalSourceSkills: iSkillRating[] = [];

  constructor(
    private messageService: MessageService,
    private skillsService: SkillService,
    private skillsCategoryService: SkillCategoryService,
    private loadingService: LoadingService,
  ) {
  }

  startLoading() {
    this.loadingService.setLoading(true);
  }

  stopLoading() {
    this.loadingService.setLoading(false);
  }

  private extractUniqueIds(dataArray) {
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

    const existingCategoryIds = this.sourceSkills.map(skill => skill.categoryId);
    const existingSubcategoryIds = this.sourceSkills.map(skill => skill.subcategoryId);

    const newCategoryIds = uniqueIds.categoryIds.filter(id => !existingCategoryIds.includes(id));
    const newSubcategoryIds = uniqueIds.subcategoryIds.filter(id => !existingSubcategoryIds.includes(id));

    if (newCategoryIds.length || newSubcategoryIds.length) {
        const dataSkills: UniqueIdsCategoriesDTO = {
            categoryIds: newCategoryIds,
            subcategoryIds: newSubcategoryIds
        };

        await this.getSkills(dataSkills);
    }
  }

  async getCategories() {
    this.startLoading();
    this.skillsCategoryService.getSkillCategoriesTree().subscribe({
      next: async (response: any) => {
        const {data} = response;
        this.skillsTree = data;
        
        this.stopLoading();
      },
      error: (err) => {
        const {error} = err;
        this.stopLoading();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error
        });
      }
    });
  }

  async getSkills(obj: UniqueIdsCategoriesDTO) {
    this.startLoading();
    this.skillsService.getSkillsByCategories(obj).subscribe({
      next: (response: any) => {
        const skillData: iSkillRating[] = response.data;
        const updatedData = skillData.map((item: any) => ({ ...item, levelId: 5 }));
  
        const newSkills = updatedData.filter(newSkill =>
          !this.originalSourceSkills.some(existingSkill => existingSkill.skillId === newSkill.skillId)
        );
  
        this.originalSourceSkills = [...this.originalSourceSkills, ...newSkills];
        this.sourceSkills = [...this.originalSourceSkills];
  
        this.sourceSkills = this.sourceSkills.filter(skill =>
          !this.targetSkills.some(targetSkill => targetSkill.skillId === skill.skillId)
        );
  
        this.collapsedTree = false;
        this.stopLoading();
      },
      error: (err) => {
        const { error } = err;
        this.stopLoading();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error
        });
      }
    });
  }

  handleSkillMove(event: any) {    
    this.onSkillsCreated.emit(this.targetSkills);
  }

  onNodeSelect(event: any) {
    const uniqueIds = this.extractUniqueIds([event.node]);
  
    const existingCategoryIds = this.sourceSkills.map(skill => skill.categoryId);
    const existingSubcategoryIds = this.sourceSkills.map(skill => skill.subcategoryId);
  
    const newCategoryIds = uniqueIds.categoryIds.filter(id => !existingCategoryIds.includes(id));
    const newSubcategoryIds = uniqueIds.subcategoryIds.filter(id => !existingSubcategoryIds.includes(id));
  
    if (newCategoryIds.length || newSubcategoryIds.length) {
      const dataSkills: UniqueIdsCategoriesDTO = {
        categoryIds: newCategoryIds,
        subcategoryIds: newSubcategoryIds
      };
  
      this.getSkills(dataSkills);
    }
  }
  
  onNodeUnselect(event: any) {
    const uniqueIds = this.extractUniqueIds([event.node]);
  
    this.sourceSkills = this.sourceSkills.filter(skill =>
      !uniqueIds.categoryIds.includes(skill.categoryId) &&
      !uniqueIds.subcategoryIds.includes(skill.subcategoryId)
    );
  
    this.targetSkills = this.targetSkills.filter(skill =>
      !uniqueIds.categoryIds.includes(skill.categoryId) &&
      !uniqueIds.subcategoryIds.includes(skill.subcategoryId)
    );
  
    this.originalSourceSkills = this.originalSourceSkills.filter(skill =>
      !uniqueIds.categoryIds.includes(skill.categoryId) &&
      !uniqueIds.subcategoryIds.includes(skill.subcategoryId)
    );
  }

  onMoveToTarget(event: any){
    this.onSkillsCreated.emit(this.targetSkills);
  }

  onMoveToSource(event: any) {
    this.onSkillsCreated.emit(this.targetSkills);
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['parentSkills'] && changes['parentSkills'].currentValue) {
      this.targetSkills = [...this.parentSkills];
  
      this.sourceSkills = this.originalSourceSkills.filter(skill =>
        !this.targetSkills.some(targetSkill => targetSkill.skillId === skill.skillId)
      );
    }
  }

  async ngOnInit(): Promise<void> {
    await this.getCategories();
  }
  
}

export interface iSkillRating {
  skillId: number;
  skillName: string;
  categoryId: number;
  subcategoryId: number;
  levelId: number;
}