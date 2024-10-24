import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CompanyService } from '../company.service';
import { ResponseApi } from '@app/core/interfaces/response-api';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrl: './read.component.scss'
})
export class ReadComponent implements OnInit {
  loading: boolean = false;
  id: number | null = null;
  imagenURL: string = null;
  dataForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
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

  get filetype() {
    return this.dataForm.get('fileType') as FormControl;
  }

  get active() {
    return this.dataForm.get('active') as FormControl;
  }

  getCompany(id: number) {
    this.companyService.getCompany(id).subscribe({
      next: (response: ResponseApi) => {        
        if (response) {
          console.log(response);
          const { status, data, message } = response;
          this.dataForm.patchValue(data);
          this.renderImage();
          this.loading = false;
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

  renderImage() {
    const { filetype, logo } = this;
    this.imagenURL = filetype.value && logo.value ? `data:${filetype.value};base64,${logo.value}` : null;
  }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      companyId: [0],
      domainmasterId: [0],
      fullName: [''],
      address: [''],
      phone: [''],
      zipcode: [''],
      logo: [null],
      fileType: [null],
      active: [false],
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) {
        this.id = +id;
        this.getCompany(this.id);
      }
    });

    this.dataForm.disable();
  }
}
