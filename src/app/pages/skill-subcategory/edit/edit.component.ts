import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '@app/pages/skill-category/models/category';
import { SkillCategoryService } from '@app/pages/skill-category/skill-category.service';
import { MessageService } from 'primeng/api';
import { SkillSubcategoryService } from '../skill-subcategory.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent {
  loading: boolean = false;
  id: number | null = null;
  dataForm!: FormGroup;

  categories!: Category[];
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
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

  onSubmit(event) {
    event.preventDefault();
    if (this.dataForm.valid) {
      const data = this.dataForm.value;
      data.subcategoryId = this.id;

      this.loading = true;
      this.skillsSubcategoriesService.updateSkillSubcategory(data.subcategoryId, data, null).subscribe({
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

  async getSubcategory(id: number) {
    this.skillsSubcategoriesService.getSkillSubcategory(id).subscribe({
      next: async (response: any) => {
        if (response) {
          const { status, data, message } = response;
          if (status == 'success') {
            this.dataForm.patchValue(data);
            this.loading = false;
          }
          if (status == 'error') {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: message
            });
          }
        } else {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while getting the subcategory.'
          });
        }
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while getting the subcategory.'
        });
      }
    });
  }

  async getSkillsCategories() {
    this.loading = true;
    this.skillsCategoriesService.getSkillCategories().subscribe({
      next: async (response: any) => {
        const {data} = response;
        console.log(data)
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

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      subcategoryId: [0],
      subcategoryName: [null, Validators.required],
      categoryId: [0, Validators.required],
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) {
        this.id = +id;
        this.getSubcategory(this.id);
      }
    });

    this.getSkillsCategories();
  }
}
