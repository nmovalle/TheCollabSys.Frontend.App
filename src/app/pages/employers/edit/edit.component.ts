import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EmployerService } from '../employer.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent {
  loading: boolean = false;
  id: number | null = null;
  employerForm!: FormGroup;

  selectedFile: File | null = null;
  imageURL: string = null;
  isUpload: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
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
      data.employerId = this.id;

      this.loading = true;
      this.employerService.updateEmployer(data.employerId, data, this.selectedFile).subscribe({
        next: async (response: any) => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Record was successfully updated.'
          });
          this.router.navigate(['/employers'], { replaceUrl: true });
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

  getEmployer(id: number) {
    this.employerService.getEmployer(this.id).subscribe({
      next: async (response: any) => {
        if (response) {
          const { status, data, message } = response;
          if (status == 'success') {
            this.employerForm.patchValue(data);
            this.renderImage();
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
            detail: 'An error occurred while getting the employer.'
          });
        }
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while getting the employer.'
        });
      }
    });
  }

  onUpload(event: any, fileUpload) {    
    this.isUpload = true;
    this.selectedFile = event.files[0];
    this.renderImage();
    fileUpload.clear();
  }
  
  renderImage() {
    if (this.isUpload) {
      this.imageURL = URL.createObjectURL(this.selectedFile);
    } else {
      const { filetype, image } = this;
      if (filetype.value && image.value) {
        this.imageURL = filetype.value && image.value ? `data:${filetype.value};base64,${image.value}` : null;
      }
    }
  }

  ngOnInit(): void {
    this.employerForm = this.fb.group({
      employerId: [0],
      employerName: [null, Validators.required],
      address: [null, Validators.required],
      phone: [null, [Validators.required, Validators.pattern('[0-9]+')]],
      image: [null],
      filetype: [null],
      active: [false, Validators.required],
      dateCreated: [null],
      dateUpdate: [null],
      userId: [null]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) {
        this.id = +id;
        this.getEmployer(this.id);
      }
    });
  }
}
