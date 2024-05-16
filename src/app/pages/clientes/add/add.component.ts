import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ClientService } from '../services/client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
})
export class AddComponent implements OnInit {
  loading: boolean = false;
  clientForm!: FormGroup;

  selectedFile: File | null = null;
  imagenURL: string = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private clientService: ClientService
  ) {
  }

  get clientID() {
    return this.clientForm.get('clientID') as FormControl;
  }

  get clientName() {
    return this.clientForm.get('clientName') as FormControl;
  }

  get address() {
    return this.clientForm.get('address') as FormControl;
  }

  get phone() {
    return this.clientForm.get('phone') as FormControl;
  }

  get email() {
    return this.clientForm.get('email') as FormControl;
  }

  get logo() {
    return this.clientForm.get('logo') as FormControl;
  }

  get filetype() {
    return this.clientForm.get('filetype') as FormControl;
  }

  get active() {
    return this.clientForm.get('active') as FormControl;
  }

  onSubmit(event) {
    event.preventDefault();
    if (this.clientForm.valid) {
      const data = this.clientForm.value;

      this.loading = true;
      this.clientService.addClient(data, this.selectedFile).subscribe({
        next: (response: any) => {
          if (response) {
            this.loading = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Record was successfully added.'
            });
            this.router.navigate(['/clients'], { replaceUrl: true });
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

  onUpload(event: any, fileUpload) {
    this.selectedFile = event.files[0];
    this.renderImage();
    fileUpload.clear();
  }
  
  renderImage() {
    this.imagenURL = URL.createObjectURL(this.selectedFile);
  }

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      clientName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      email: ['', [Validators.required, Validators.email]],
      active: [true, [Validators.required]],
    });
  }
}
