import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EmployerService } from '../employer.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
})
export class AddComponent {
  loading: boolean = false;
  employerForm!: FormGroup;

  selectedFile: File | null = null;
  imageURL: string = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private employerService: EmployerService
  ) {
  }

  get employerId() {
    return this.employerForm.get('employerId') as FormControl;
  }

  get employerName() {
    return this.employerForm.get('employerName') as FormControl;
  }

  get address() {
    return this.employerForm.get('address') as FormControl;
  }

  get phone() {
    return this.employerForm.get('phone') as FormControl;
  }

  get image() {
    return this.employerForm.get('image') as FormControl;
  }

  get filetype() {
    return this.employerForm.get('filetype') as FormControl;
  }

  get active() {
    return this.employerForm.get('active') as FormControl;
  }


  onSubmit(event) {
    event.preventDefault();
    if (this.employerForm.valid) {
      const data = this.employerForm.value;

      this.loading = true;
      this.employerService.addEmployer(data, this.selectedFile).subscribe({
        next: (response: any) => {
          if (response) {
            this.loading = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Record was successfully added.'
            });
            this.router.navigate(['/employers'], { replaceUrl: true });
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
    this.imageURL = URL.createObjectURL(this.selectedFile);
  }

  ngOnInit(): void {
    this.employerForm = this.fb.group({
      employerName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      active: [true, [Validators.required]],
    });
  }
}
