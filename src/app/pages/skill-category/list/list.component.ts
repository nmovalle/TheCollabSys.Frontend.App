import { Component } from '@angular/core';
import { SkillCategoryService } from '../skill-category.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from '@app/core/guards/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  deleteEntityDialog: boolean = false;
  deleteEntitiesDialog: boolean = false;

  categories!: any[];
  category = {} as any;
  selectedEntities: any[];
  
  cols: any[] = [];
  permissions: {};

  constructor(
    private skillsCategoriesService: SkillCategoryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cols = [
      { field: 'categoryName', header: 'Category Name' },
    ];
    this.permissions = this.authService.getPermissions(this.router.url);
  }

  confirmDelete(id?: number): void {
    const hdr = "Confirm"
    let msg = "Are you sure you want to delete this record?"

    if(!id && this.selectedEntities.length > 0) {
      msg = "Are you sure you want to delete these records?"
    }

    this.confirmationService.confirm({
      header: hdr,
      message: msg,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteEntity(id);
      },
      reject: () => {
      }
    });
  }

  deleteSelected() {
    this.deleteEntitiesDialog = true;
  }

  deleteEntity(id: number) {
    this.deleteEntityDialog = true;
    this.skillsCategoriesService.deleteSkillCategory(id).subscribe({
      next: async () => {
        this.categories = this.categories.filter(c => c.categoryId !== id);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The category was successfully removed'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error deleting the category'
        });
      },
      complete: () => {
        this.deleteEntityDialog = false;
      }
    });
  }

  async getCategories() {
    this.skillsCategoriesService.getSkillCategories().subscribe({
      next: async (response: any) => {
        const {data} = response;
        this.categories = response.data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error getting the categories'
        });
      }
    });    
  }

  ngOnInit() {
    this.getCategories();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
