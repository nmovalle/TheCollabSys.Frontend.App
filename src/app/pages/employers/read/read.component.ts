import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EmployerService } from '../employer.service';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
})
export class ReadComponent {
  loading: boolean = false;
  id: number | null = null;
  imageURL: string = null;
  employerForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
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

  renderImage() {
    const { filetype, image } = this;
    this.imageURL = filetype.value && image.value ? `data:${filetype.value};base64,${image.value}` : null;
  }

  ngOnInit(): void {
    this.employerForm = this.fb.group({
      employerName: [''],
      address: [''],
      phone: [''],
      image: [null],
      filetype: [null],
      active: [false],
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) {
        this.id = +id;
        this.getEmployer(this.id);
      }
    });

    this.employerForm.disable();
  }
}
