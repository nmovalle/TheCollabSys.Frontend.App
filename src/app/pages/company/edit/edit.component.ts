import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CompanyService } from '../company.service';
import { ResponseApi } from '@app/core/interfaces/response-api';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit {
  loading: boolean = false;
  id: number | null = null;
  dataForm!: FormGroup;

  selectedFile: File | null = null;
  imagenURL: string = null;
  isUpload: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private companyService: CompanyService
  ) {
  }

  get companyId() {
    return this.dataForm.get('companyId') as FormControl;
  }

  get domainmasterId() {
    return this.dataForm.get('domainmasterId') as FormControl;
  }

  get fullName() {
    return this.dataForm.get('fullName') as FormControl;
  }

  get address() {
    return this.dataForm.get('address') as FormControl;
  }

  get zipcode() {
    return this.dataForm.get('zipcode') as FormControl;
  }

  get phone() {
    return this.dataForm.get('phone') as FormControl;
  }

  get logo() {
    return this.dataForm.get('logo') as FormControl;
  }

  get fileType() {
    return this.dataForm.get('fileType') as FormControl;
  }

  get active() {
    return this.dataForm.get('active') as FormControl;
  }

  onSubmit(event) {
    event.preventDefault();
    if (this.dataForm.valid) {
      const data = this.dataForm.value;
      data.companyId = this.id;

      this.loading = true;
      this.companyService.updateCompany(data.companyId, data, this.selectedFile).subscribe({
        next: async (response: any) => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Record was successfully updated.'
          });
          this.router.navigate(['/companies'], { replaceUrl: true });
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

  getCompany(id: number) {
    this.companyService.getCompany(id).subscribe({
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
            detail: 'An error occurred while getting the company.'
          });
        }
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while getting the company.'
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
      const { fileType, logo } = this;
      if (fileType.value && logo.value) {
        this.imagenURL = fileType.value && logo.value ? `data:${fileType.value};base64,${logo.value}` : null;
      }
    }
  }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      companyId: [0],
      domainmasterId: [0],
      fullName: [null, Validators.required],
      address: [null, Validators.required],
      phone: [null, [Validators.required, Validators.pattern('[0-9]+')]],
      zipcode: [null, Validators.required],
      logo: [null],
      fileType: [null],
      active: [false, Validators.required]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) {
        this.id = +id;
        this.getCompany(this.id);
      }
    });
  }
}
