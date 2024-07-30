import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuEntity } from '@app/core/interfaces/menu';
import { MenuService } from '@app/pages/menus/menu.service';
import { MessageService } from 'primeng/api';
import { SubmenuService } from '../submenu.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent implements OnInit {
  loading: boolean = false;
  dataForm!: FormGroup;

  selectedFile: File | null = null;
  imageURL: string = null;

  menus!: MenuEntity[];
  
  constructor(
    private fb: FormBuilder,
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

  onSubmit(event) {
    event.preventDefault();
    if (this.dataForm.valid) {
      const data = this.dataForm.value;

      this.loading = true;
      this.subMenuService.addSubMenu(data, this.selectedFile).subscribe({
        next: (response: any) => {
          if (response) {
            this.loading = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Record was successfully added.'
            });
            this.router.navigate(['/menus/submenus'], { replaceUrl: true });
          } else {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'An error occurred while adding the record.'
            });
          }
        },
        error: () => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while adding the record.'
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

  async ngOnInit(): Promise<void> {
    this.dataForm = this.fb.group({
      subMenuId: [0, Validators.required],
      menuId: [0, Validators.required],
      subMenuName: [null, Validators.required],
      description: [null, Validators.required],
      icon: [null, Validators.required],
      routerLink: [null, Validators.required]
    });

    this.getMenus();
  }
}
