import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EngineerService } from '../engineer.service';
import { Employer } from '@app/pages/employers/models/employer';
import { EmployerService } from '@app/pages/employers/employer.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
})
export class AddComponent {
  loading: boolean = false;
  dataForm!: FormGroup;

  selectedFile: File | null = null;
  imageURL: string = null;

  employers!: Employer[];

  constructor(
    private fb: FormBuilder,
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

  async getEmployers() {
    this.loading = true;
    this.employerService.getEmployers().subscribe({
      next: async (response: any) => {
        const {data} = response;
        console.log(data)
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

      this.loading = true;
      this.engineerService.addEngineer(data, this.selectedFile).subscribe({
        next: (response: any) => {
          console.log(response)
          if (response) {
            this.loading = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Record was successfully added.'
            });
            this.router.navigate(['/engineers'], { replaceUrl: true });
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
    this.dataForm = this.fb.group({
      engineerName: ['', Validators.required],
      employerId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      isActive: [true, [Validators.required]],
    });

    this.getEmployers();
  }
}
