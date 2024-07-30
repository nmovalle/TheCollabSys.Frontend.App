import { Component, OnInit } from '@angular/core';
import { SkillSubcategoryService } from '../skill-subcategory.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from '@app/core/guards/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  deleteEntityDialog: boolean = false;
  deleteEntitiesDialog: boolean = false;

  subcategories!: any[];
  subcategory = {} as any;
  selectedEntities: any[];
  
  cols: any[] = [];
  permissions: {};

  constructor(
    private skillsSubcategoriesService: SkillSubcategoryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cols = [
      { field: 'categoryName', header: 'Category Name' },
      { field: 'subcategoryName', header: 'Subcategory Name' },
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
    this.skillsSubcategoriesService.deleteSkillSubcategory(id).subscribe({
      next: async () => {
        this.subcategories = this.subcategories.filter(c => c.subcategoryId !== id);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The subcategory was successfully removed'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error deleting the subcategory'
        });
      },
      complete: () => {
        this.deleteEntityDialog = false;
      }
    });
  }

  async getSubcategories() {
    this.skillsSubcategoriesService.getSkillSubcategories().subscribe({
      next: async (response: any) => {
        const {data} = response;
        this.subcategories = response.data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error getting the subcategories'
        });
      }
    });    
  }

  ngOnInit() {
    this.getSubcategories();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
