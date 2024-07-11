import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ProjectService } from '../project.service';
import { ClientService } from '@app/pages/clientes/services/client.service';
import { Client } from '@app/pages/clientes/models/client';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent {
  loading: boolean = false;
  id: number | null = null;
  dataForm!: FormGroup;

  clients!: Client[];
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private projectService: ProjectService,
    private clientService: ClientService
  ) {
  }

  get projectId() {
    return this.dataForm.get('projectId') as FormControl;
  }

  get projectName() {
    return this.dataForm.get('projectName') as FormControl;
  }

  get clientId() {
    return this.dataForm.get('clientId') as FormControl;
  }

  get clientName() {
    return this.dataForm.get('clientName') as FormControl;
  }

  get projectDescription() {
    return this.dataForm.get('projectDescription') as FormControl;
  }

  get numberPositionTobeFill() {
    return this.dataForm.get('numberPositionTobeFill') as FormControl;
  }

  get startDate() {
    return this.dataForm.get('startDate') as FormControl;
  }

  get endDate() {
    return this.dataForm.get('endDate') as FormControl;
  }

  get statusId() {
    return this.dataForm.get('statusId') as FormControl;
  }

  onSubmit(event) {
    event.preventDefault();
    if (this.dataForm.valid) {
      const data = this.dataForm.value;
      data.projectId = this.id;

      this.loading = true;
      this.projectService.updateProject(data.projectId, data, null).subscribe({
        next: async (response: any) => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Record was successfully updated.'
          });
          this.router.navigate(['/projects'], { replaceUrl: true });
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

  getProject(id: number) {
    this.projectService.getProject(this.id).subscribe({
      next: async (response: any) => {
        if (response) {
          const { status, data, message } = response;
          if (status == 'success') {
            data.startDate = data.startDate ? new Date(data.startDate) : null;
            data.endDate = data.endDate ? new Date(data.endDate) : null;
            this.dataForm.patchValue(data);
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
            detail: 'An error occurred while getting the project.'
          });
        }
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while getting the project.'
        });
      }
    });
  }

  getClients() {
    this.loading = true;
    this.clientService.getClients().subscribe({
      next: async (response: any) => {
        const {data} = response;
        this.clients = response.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error getting the customer'
        });
      }
    });    
  }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      projectId: [0],
      projectName: [null, Validators.required],
      clientId: [null, Validators.required],
      clientName: [null, Validators.required],
      projectDescription: [null, Validators.required],
      numberPositionTobeFill: [null, [Validators.required, Validators.pattern('[0-9]')]],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      statusId: [null, Validators.required],
      dateCreated: [null],
      dateUpdate: [null],
      userId: [null]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) {
        this.id = +id;
        this.getProject(this.id);
      }
    });

    this.getClients();
  }
}
