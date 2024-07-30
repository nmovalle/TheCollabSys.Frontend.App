import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SkillCategoryService } from '../skill-category.service';

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
    private messageService: MessageService,
    private skillsCategoriesService: SkillCategoryService
  ) {
  }

  getCategory(id: number) {
    this.skillsCategoriesService.getSkillCategory(id).subscribe({
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
            detail: 'An error occurred while getting the category.'
          });
        }
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while getting the category.'
        });
      }
    });
  }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      categoryId: [0],
      categoryName: [null]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) {
        this.id = +id;
        this.getCategory(this.id);
      }
    });
  }
}
