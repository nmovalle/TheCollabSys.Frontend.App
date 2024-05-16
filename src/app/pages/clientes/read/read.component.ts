import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
})
export class ReadComponent implements OnInit {
  loading: boolean = false;
  id: number | null = null;
  imagenURL: string = null;
  clientForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
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

  renderImage() {
    const { filetype, logo } = this;
    this.imagenURL = filetype.value && logo.value ? `data:${filetype.value};base64,${logo.value}` : null;
  }

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      clientName: [''],
      address: [''],
      phone: [''],
      email: [''],
      logo: [null],
      filetype: [null],
      active: [false],
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) {
        this.id = +id;
        this.getClient(this.id);
      }
    });

    this.clientForm.disable();
  }
}
