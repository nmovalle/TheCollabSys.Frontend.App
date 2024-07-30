import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SkillService } from '../skill.service';
import { SkillCategory } from '@app/core/interfaces/skill-category';
import { SkillSubcategory } from '@app/core/interfaces/skill-subcategory';
import { SkillCategoryService } from '@app/pages/skill-category/skill-category.service';
import { SkillSubcategoryService } from '@app/pages/skill-subcategory/skill-subcategory.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {
  loading: boolean = false;
  id: number | null = null;
  skillForm!: FormGroup;

  selectedFile: File | null = null;
  imageURL: string = null;
  isUpload: boolean = false;

  categories!: SkillCategory[];
  listSubcategories!: SkillSubcategory[];
  subcategories!: SkillSubcategory[];
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
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

  async getSubcategories() {
    this.loading = true;
    this.skillSubcategoryService.getSkillSubcategories().subscribe({
      next: async (response: any) => {
        const {data} = response;
        this.subcategories = response.data;
        this.listSubcategories = response.data;

        this.listSubcategories.unshift({
          subcategoryId: 0,
          subcategoryName: 'Choose an item'
        });

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
      data.skillId = this.id;

      if (data.subcategoryId <= 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please select a valid subcategory'
        });
        return;
      } 

      this.loading = true;
      this.skillService.updateSkill(data.skillId, data, this.selectedFile).subscribe({
        next: async (response: any) => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Record was successfully updated.'
          });
          this.router.navigate(['/skills'], { replaceUrl: true });
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

  getSkill(id: number) {
    this.skillService.getSkill(id).subscribe({
      next: async (response: any) => {
        if (response) {
          const { status, data, message } = response;
          if (status == 'success') {
            this.skillForm.patchValue(data);
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
            detail: 'An error occurred while getting the skill.'
          });
        }
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while getting the skill.'
        });
      }
    });
  }

  onUpload(event: any, fileUpload) {    
    this.isUpload = true;
    this.selectedFile = event.files[0];
    fileUpload.clear();
  }
  
  async ngOnInit(): Promise<void> {
    this.skillForm = this.fb.group({
      skillId: [0],
      skillName: [null, Validators.required],
      categoryId: [null, Validators.required],
      subcategoryId: [null, Validators.required]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) {
        this.id = +id;
        this.getSkill(this.id);
      }
    });

    await this.getCategories();
    await this.getSubcategories();
  }
}
