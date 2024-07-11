import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SubmenuService } from '../submenu.service';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
})
export class ReadComponent {
  loading: boolean = false;
  id: number | null = null;
  imageURL: string = null;
  dataForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private subMenuService: SubmenuService
  ) {
    
  }

  async getSubMenu(id: number) {
    this.subMenuService.getSubMenu(id).subscribe({
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
            detail: 'An error occurred while getting the sub menu.'
          });
        }
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while getting the sub menu.'
        });
      }
    });
  }


  ngOnInit(): void {
    this.dataForm = this.fb.group({
      subMenuId: [''],
      menuId: [''],
      menuName: [''],
      subMenuName: [''],
      description: [''],
      icon: [''],
      routerLink: ['']
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) {
        this.id = +id;
        this.getSubMenu(this.id);
      }
    });
  }
}
