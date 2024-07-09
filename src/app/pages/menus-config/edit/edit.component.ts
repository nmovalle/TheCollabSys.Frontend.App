import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MenusConfigService } from '../menus-config.service';
import { Role } from '@app/core/interfaces/role';
import { SubMenuEntity } from '@app/core/interfaces/menu';
import { RoleService } from '@app/core/service/role.service';
import { SubmenuService } from '@app/pages/submenus/submenu.service';

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

  roles!: Role[];
  subMenus!: SubMenuEntity[];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private menuRoleService: MenusConfigService,
    private roleService: RoleService,
    private subMenuService: SubmenuService
  ) {
  }

  get roleId() {
    return this.dataForm.get('roleId') as FormControl;
  }

  get roleName() {
    return this.dataForm.get('roleName') as FormControl;
  }

  get subMenuId() {
    return this.dataForm.get('subMenuId') as FormControl;
  }

  get subMenuName() {
    return this.dataForm.get('subMenuName') as FormControl;
  }

  get view() {
    return this.dataForm.get('view') as FormControl;
  }

  get add() {
    return this.dataForm.get('add') as FormControl;
  }

  get edit() {
    return this.dataForm.get('edit') as FormControl;
  }

  get delete() {
    return this.dataForm.get('delete') as FormControl;
  }

  get export() {
    return this.dataForm.get('export') as FormControl;
  }

  get import() {
    return this.dataForm.get('import') as FormControl;
  }

  onSubmit(event) {
    event.preventDefault();
    if (this.dataForm.valid) {
      const data = this.dataForm.value;
      data.menuRoleId = this.id;

      this.loading = true;
      this.menuRoleService.updateMenuRle(data.menuRoleId, data, this.selectedFile).subscribe({
        next: async (response: any) => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Record was successfully updated.'
          });
          this.router.navigate(['/menus/config'], { replaceUrl: true });
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

  async getRoles() {
    this.roleService.getRoles().subscribe({
      next: async (response: any) => {
        this.roles = response;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error getting roles'
        });
      }
    });
  }

  async getSubMenus() {
    this.loading = true;
    this.subMenuService.getSubMenus().subscribe({
      next: async (response: any) => {
        const {data} = response;
        this.subMenus = response.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error getting the sub menus'
        });
      }
    });    
  }

  getMenuRole(id: number) {
    this.menuRoleService.getMenuRole(id).subscribe({
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
            detail: 'An error occurred while getting the menu.'
          });
        }
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while getting the menu.'
        });
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.dataForm = this.fb.group({
      roleId: [0],
      subMenuId: [0],
      view: [false, Validators.required],
      add: [false, Validators.required],
      edit: [false, Validators.required],
      delete: [false, Validators.required],
      export: [false, Validators.required],
      import: [false, Validators.required]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) {
        this.id = +id;
        this.getMenuRole(this.id);
      }
    });

    this.getRoles();
    this.getSubMenus();
  }
}
