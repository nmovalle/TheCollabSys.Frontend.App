import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MenuService } from '../menu.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
})
export class AddComponent implements OnInit {
  loading: boolean = false;
  dataForm!: FormGroup;

  selectedFile: File | null = null;
  imageURL: string = null;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private menuService: MenuService
  ) {
  }

  get menuId() {
    return this.dataForm.get('menuId') as FormControl;
  }

  get menuName() {
    return this.dataForm.get('menuName') as FormControl;
  }

  get description() {
    return this.dataForm.get('description') as FormControl;
  }

  onSubmit(event) {
    event.preventDefault();
    if (this.dataForm.valid) {
      const data = this.dataForm.value;

      this.loading = true;
      this.menuService.addMenu(data, this.selectedFile).subscribe({
        next: (response: any) => {
          if (response) {
            this.loading = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Record was successfully added.'
            });
            this.router.navigate(['/menus'], { replaceUrl: true });
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
      menuId: [0],
      menuName: [null, Validators.required],
      description: [null, Validators.required]
    });
  }
}
