import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EngineerService } from '../engineer.service';
import { Employer } from '@app/pages/employers/models/employer';
import { EmployerService } from '@app/pages/employers/employer.service';
import { ResponseApi } from '@app/core/interfaces/response-api';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent {
  loading: boolean = false;
  id: number | null = null;
  dataForm!: FormGroup;

  selectedFile: File | null = null;
  imagenURL: string = null;
  isUpload: boolean = false;

  employers!: Employer[];
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private engineerService: EngineerService,
    private employerService: EmployerService
  ) {
  }

  get engineerId() {
    return this.dataForm.get('engineerId') as FormControl;
  }

  get engineerName() {
    return this.dataForm.get('engineerName') as FormControl;
  }

  get firstName() {
    return this.dataForm.get('firstName') as FormControl;
  }

  get lastName() {
    return this.dataForm.get('lastName') as FormControl;
  }

  get email() {
    return this.dataForm.get('email') as FormControl;
  }

  get phone() {
    return this.dataForm.get('phone') as FormControl;
  }

  get isActive() {
    return this.dataForm.get('isActive') as FormControl;
  }

  get image() {
    return this.dataForm.get('image') as FormControl;
  }

  get filetype() {
    return this.dataForm.get('filetype') as FormControl;
  }

  async getEmployers() {
    this.loading = true;
    this.employerService.getEmployers().subscribe({
      next: async (response: any) => {
        const {data} = response;
        this.employers = response.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error getting the employers'
        });
      }
    });    
  }

  onSubmit(event) {
    event.preventDefault();
    if (this.dataForm.valid) {
      const data = this.dataForm.value;
      data.engineerId = this.id;

      this.loading = true;
      this.engineerService.updateEngineer(data.engineerId, data, this.selectedFile).subscribe({
        next: async (response: any) => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Record was successfully updated.'
          });
          this.router.navigate(['/engineers'], { replaceUrl: true });
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

  getEngineer(id: number) {
    this.engineerService.getEngineer(id).subscribe({
      next: async (response: ResponseApi) => {
        if (response) {
          const { status, data, message } = response;
          if (status == 'success') {
            this.dataForm.patchValue(data);
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
            detail: 'An error occurred while getting the engineer.'
          });
        }
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while getting the engineer.'
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
      this.imagenURL = URL.createObjectURL(this.selectedFile);
    } else {
      const { filetype, image } = this;
      if (filetype.value && image.value) {
        this.imagenURL = filetype.value && image.value ? `data:${filetype.value};base64,${image.value}` : null;
      }
    }
  }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      engineerName: ['', Validators.required],
      employerId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      isActive: [true, [Validators.required]],
      image: [null],
      filetype: [null],
      dateCreated: [null],
      dateUpdate: [null],
      userId: [null]
    });

    this.getEmployers();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) {
        this.id = +id;
        this.getEngineer(this.id);
      }
    });
  }
}
