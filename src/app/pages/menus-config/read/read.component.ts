import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MenusConfigService } from '../menus-config.service';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
})
export class ReadComponent implements OnInit {
  loading: boolean = false;
  id: number | null = null;
  imageURL: string = null;
  dataForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private menuRoleService: MenusConfigService
  ) {
    
  }

  async getMenuRole(id: number) {
    this.menuRoleService.getMenuRole(id).subscribe({
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
            detail: 'An error occurred while getting the menu role.'
          });
        }
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while getting the sub menu role.'
        });
      }
    });
  }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      roleId: [''],
      roleName: [''],
      subMenuId: [''],
      subMenuName: [''],
      view: [''],
      add: [''],
      edit: [''],
      delete: [''],
      export: [''],
      import: ['']
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) {
        this.id = +id;
        this.getMenuRole(this.id);
      }
    });
  }
}
