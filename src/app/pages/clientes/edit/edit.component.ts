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

  onSubmit() {     
    if (this.clientForm.valid) {
      const data = this.clientForm.value;
      data.clientID = this.id;
      this.loading = true;
      this.clientService.updateClient(this.id, data).subscribe({
        next: (response: any) => {
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

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      clientName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      email: ['', [Validators.required, Validators.email]],
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
