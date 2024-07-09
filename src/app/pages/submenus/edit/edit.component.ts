import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SubmenuService } from '../submenu.service';
import { MenuEntity } from '@app/core/interfaces/menu';
import { MenuService } from '@app/pages/menus/menu.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent {
  loading: boolean = false;
  id: number | null = null;
  dataForm!: FormGroup;

  selectedFile: File | null = null;
  imageURL: string = null;
  isUpload: boolean = false;

  menus!: MenuEntity[];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private menuService: MenuService,
    private subMenuService: SubmenuService
  ) {
  }

  get subMenuId() {
    return this.dataForm.get('subMenuId') as FormControl;
  }

  get menuId() {
    return this.dataForm.get('menuId') as FormControl;
  }

  get menuName() {
    return this.dataForm.get('menuName') as FormControl;
  }

  get subMenuName() {
    return this.dataForm.get('subMenuName') as FormControl;
  }

  get description() {
    return this.dataForm.get('description') as FormControl;
  }

  get icon() {
    return this.dataForm.get('icon') as FormControl;
  }

  get routerLink() {
    return this.dataForm.get('routerLink') as FormControl;
  }

  onSubmit(event) {
    event.preventDefault();
    if (this.dataForm.valid) {
      const data = this.dataForm.value;
      data.subMenuId = this.id;

      this.loading = true;
      this.subMenuService.updateSubMenu(data.subMenuId, data, this.selectedFile).subscribe({
        next: async (response: any) => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Record was successfully updated.'
          });
          this.router.navigate(['/menus/submenus'], { replaceUrl: true });
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

  async getMenus() {
    this.loading = true;
    this.menuService.getMenus().subscribe({
      next: async (response: any) => {
        const {data} = response;
        this.menus = response.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error getting the menus'
        });
      }
    });    
  }

  async getSubMenu(id: number) {
    this.subMenuService.getSubMenu(id).subscribe({
      next: async (response: any) => {
        if (response) {
          const { status, data, message } = response;
          console.log(data)
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

  async ngOnInit(): Promise<void> {
    this.dataForm = this.fb.group({
      subMenuId: [0, Validators.required],
      menuId: [0, Validators.required],
      subMenuName: [null, Validators.required],
      description: [null, Validators.required],
      icon: [null, Validators.required],
      routerLink: [null, Validators.required]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) {
        this.id = +id;
        this.getSubMenu(this.id);
      }
    });

    this.getMenus();
  }
}
