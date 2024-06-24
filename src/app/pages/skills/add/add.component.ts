import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SkillService } from '../skill.service';
import { SkillCategory } from '@app/core/interfaces/skill-category';
import { SkillSubcategory } from '@app/core/interfaces/skill-subcategory';
import { SkillCategoryService } from '@app/pages/skill-category/skill-category.service';
import { SkillSubcategoryService } from '@app/pages/skill-subcategory/skill-subcategory.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
})
export class AddComponent {
  loading: boolean = false;
  skillForm!: FormGroup;

  selectedFile: File | null = null;
  imageURL: string = null;

  categories!: SkillCategory[];
  listSubcategories!: SkillSubcategory[];
  subcategories!: SkillSubcategory[];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private skillService: SkillService,
    private skillCategoryService: SkillCategoryService,
    private skillSubcategoryService: SkillSubcategoryService
  ) {
  }

  get skillId() {
    return this.skillForm.get('skillId') as FormControl;
  }

  get skillName() {
    return this.skillForm.get('skillName') as FormControl;
  }

  get categoryId() {
    return this.skillForm.get('categoryId') as FormControl;
  }

  get subcategoryId() {
    return this.skillForm.get('subcategoryId') as FormControl;
  }

  async getCategories() {
    this.loading = true;
    this.skillCategoryService.getSkillCategories().subscribe({
      next: async (response: any) => {
        const {data} = response;
        console.log(data)
        this.categories = response.data;
        this.categories.unshift({
          categoryId: 0,
          categoryName: 'Choose an item'
        });

        this.categoryId.setValue(0);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error getting the categories'
        });
      }
    });    
  }

  async getSubcategories() {
    this.loading = true;
    this.skillSubcategoryService.getSkillSubcategories().subscribe({
      next: async (response: any) => {
        const {data} = response;
        console.log(data);
        this.subcategories = response.data;
        this.listSubcategories = response.data;

        this.listSubcategories.unshift({
          subcategoryId: 0,
          subcategoryName: 'Choose an item'
        });


        this.subcategoryId.setValue(0);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error getting the subcategories'
        });
      }
    });    
  }

  loadCategories(categoryId: number) {
    this.listSubcategories = this.subcategories
      .filter((x) => x.categoryId == categoryId)
      .map((x) => ({
        subcategoryId: x.subcategoryId,
        subcategoryName: x.subcategoryName
      }));

      this.listSubcategories.unshift({
        subcategoryId: 0,
        subcategoryName: 'Choose an item'
      });

      this.subcategoryId.setValue(0);
  }

  onSubmit(event) {
    event.preventDefault();
    if (this.skillForm.valid) {
      const data = this.skillForm.value;

      if (data.categoryId <= 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please select a valid category'
        });
        return;
      } 
      if (data.subcategoryId <= 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please select a valid subcategory'
        });
        return;
      } 

      this.loading = true;
      this.skillService.addSkill(data, this.selectedFile).subscribe({
        next: (response: any) => {
          console.log(response)
          if (response) {
            this.loading = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Record was successfully added.'
            });
            this.router.navigate(['/skills'], { replaceUrl: true });
          } else {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'An error occurred while adding the record.'
            });
          }
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
      
    } else {
      this.loading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'The form is not valid. Please fill the required fields.'
      });
    }
  }

  async ngOnInit(): Promise<void> {
    this.skillForm = this.fb.group({
      skillName: [null, Validators.required],
      categoryId: [null, Validators.required],
      subcategoryId: [null, Validators.required]
    });

    await this.getCategories();
    await this.getSubcategories();
  }
}
