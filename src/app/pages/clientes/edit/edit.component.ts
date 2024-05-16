import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {
  loading: boolean = false;
  id: number | null = null;
  clientForm!: FormGroup;

  selectedFile: File | null = null;
  imagenURL: string = null;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
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
      data.ClientID = this.id;

      this.loading = true;
      this.clientService.updateClient(data.ClientID, data, this.selectedFile).subscribe({
        next: async (response: any) => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Record was successfully updated.'
          });
          this.router.navigate(['/clients'], { replaceUrl: true });
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

  getClient(id: number) {
    this.clientService.getClient(this.id).subscribe({
      next: (response: any) => {
        if (response) {
          this.clientForm.patchValue(response);
          this.renderImage();
          this.loading = false;
        } else {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while getting the customer.'
          });
        }
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while getting the customer.'
        });
      }
    });
  }

  onUpload(event: any, fileUpload) {
    this.selectedFile = event.files[0];
    this.renderImage();
    fileUpload.clear();
  }
  
  renderImage() {
    if (this.imagenURL) {
      this.imagenURL = URL.createObjectURL(this.selectedFile);
    } else {
      const { filetype, logo } = this;
      this.imagenURL = filetype.value && logo.value ? `data:${filetype.value};base64,${logo.value}` : null;
    }
  }

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      clientID: [0],
      clientName: [null, Validators.required],
      address: [null, Validators.required],
      phone: [null, [Validators.required, Validators.pattern('[0-9]+')]],
      email: [null, [Validators.required, Validators.email]],
      logo: [null],
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
        this.getClient(this.id);
      }
    });
  }
}
