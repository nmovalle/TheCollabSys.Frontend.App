import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SkillSubcategoryService } from '../skill-subcategory.service';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
})
export class ReadComponent implements OnInit {
  loading: boolean = false;
  id: number | null = null;
  dataForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private skillsSubcategoriesService: SkillSubcategoryService,
  ) {
  }

  get categoryName() {
    return this.dataForm.get('categoryName') as FormControl;
  }

  get subcategoryName() {
    return this.dataForm.get('subcategoryName') as FormControl;
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

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      subcategoryId: [0],
      categoryName: [null],
      subcategoryName: [null]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) {
        this.id = +id;
        this.getSubcategory(this.id);
      }
    });
  }
}
