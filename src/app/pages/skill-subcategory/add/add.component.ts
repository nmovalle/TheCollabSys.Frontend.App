import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from '@app/pages/skill-category/models/category';
import { SkillCategoryService } from '@app/pages/skill-category/skill-category.service';
import { MessageService } from 'primeng/api';
import { SkillSubcategoryService } from '../skill-subcategory.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
})
export class AddComponent implements OnInit {
  loading: boolean = false;
  dataForm!: FormGroup;

  categories!: Category[];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private skillsCategoriesService: SkillCategoryService,
    private skillsSubcategoriesService: SkillSubcategoryService,
  ) {
  }

  get subcategoryId() {
    return this.dataForm.get('subcategoryId') as FormControl;
  }

  get subcategoryName() {
    return this.dataForm.get('subcategoryName') as FormControl;
  }

  get categoryId() {
    return this.dataForm.get('categoryId') as FormControl;
  }

  async getSkillsCategories() {
    this.loading = true;
    this.skillsCategoriesService.getSkillCategories().subscribe({
      next: async (response: any) => {
        const {data} = response;
        this.categories = response.data;
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

  onSubmit(event) {
    event.preventDefault();
    if (this.dataForm.valid) {
      const data = this.dataForm.value;

      this.loading = true;
      this.skillsSubcategoriesService.addSkillSubcategory(data, null).subscribe({
        next: async (response: any) => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Record was successfully updated.'
          });
          this.router.navigate(['/skills/subcategories'], { replaceUrl: true });
        },
        error: () => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while updating the record.'
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
  
  ngOnInit(): void {
    this.dataForm = this.fb.group({
      subcategoryId: [0],
      subcategoryName: [null, Validators.required],
      categoryId: [0, Validators.required],
    });

    this.getSkillsCategories();
  }
}
