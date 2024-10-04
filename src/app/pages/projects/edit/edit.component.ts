import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ProjectService } from '../project.service';
import { ClientService } from '@app/pages/clientes/services/client.service';
import { Client } from '@app/pages/clientes/models/client';
import { StatusService } from '@app/core/service/status.service';
import { StatusDTO } from '@app/core/interfaces/status';
import { iSkillRating } from '@app/core/components/skills/skills.component';
import { ProjectSkillService } from '@app/pages/project-skill/project-skill.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {
  loading = false;
  id: number | null = null;
  dataForm!: FormGroup;
  
  clients: Client[] = [];
  displayAddClientDialog = false;
  
  status: StatusDTO[] = [];
  projectSavedId: number | null = null;
  projectSkills: iSkillRating[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private projectService: ProjectService,
    private clientService: ClientService,
    private statusService: StatusService,
    private projectSkillService: ProjectSkillService
  ) {}

  get getFolio() { return this.dataForm.get('folio') as FormControl; }
  get projectId() { return this.dataForm.get('projectId') as FormControl; }
  get projectName() { return this.dataForm.get('projectName') as FormControl; }
  get clientId() { return this.dataForm.get('clientId') as FormControl; }
  get clientName() { return this.dataForm.get('clientName') as FormControl; }
  get projectDescription() { return this.dataForm.get('projectDescription') as FormControl; }
  get numberPositionTobeFill() { return this.dataForm.get('numberPositionTobeFill') as FormControl; }
  get startDate() { return this.dataForm.get('startDate') as FormControl; }
  get endDate() { return this.dataForm.get('endDate') as FormControl; }
  get statusId() { return this.dataForm.get('statusId') as FormControl; }

  async onSubmit(event): Promise<void> {
    event.preventDefault();

    console.log(this.projectSkills)

    if (this.dataForm.invalid) {
      Object.keys(this.dataForm.controls).forEach(field => {
        const control = this.dataForm.get(field);
        control?.markAsTouched({ onlySelf: true });
  
        if (control?.invalid) {
          let errorMessage = this.getErrorMessage(field);
          this.messageService.add({
            severity: 'error',
            summary: 'Validation Error',
            detail: errorMessage
          });
        }
      });
  
      if (this.dataForm.hasError('dateRangeInvalid')) {
        this.messageService.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: 'End Date cannot be earlier than Start Date.'
        });
      }
  
      if (this.dataForm.hasError('projectSkillsRequired')) {
        this.messageService.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: 'Project skills is required. Please add at least one skill.'
        });
      }
  
      return;
    }

    this.loading = true;
    const data = this.dataForm.value;
    data.projectId = this.id;
    await this.saveProject(data.projectId, data);
    await this.saveProjectSkills();

    this.router.navigate(['/projects'], { replaceUrl: true });
    this.loading = false;
  }

  async saveProject(id: number, data: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.projectService.updateProject(id, data, null).subscribe({
        next: async (response: any) => {
          const { data } = response;
          this.projectSavedId = data.projectId;

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Record was successfully updated.'
          });
          this.loading = false;
          resolve();
        },
        error: async(err) => {
          const {error} = err;
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error
          });
          reject();
        },
        complete: () => {
          this.loading = false;
        }
      });
    });    
  }

  async saveProjectSkills(): Promise<void> {
    this.loading = false;
    const data = {
      projectId: this.projectSavedId,
      skills: this.projectSkills
    };
    return new Promise<void>((resolve, reject) => {
      this.projectSkillService.addProjectSkill(data, null).subscribe({
        next: (response: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'The project skills was successfully registered.'
          });
          this.loading = false;
          resolve();
        },
        error: (err) => {
          const {error} = err;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error
          });
          reject();
        },
        complete: () => {
          this.loading = false;
        }
      });
    });
  }

  async getProject(id: number) {
    this.projectService.getProject(id).subscribe({
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
      error: async (err) => {
        const {error} = err;
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error
        });
      }
    });
  }

  async getClients() {
    this.loading = true;
    this.clientService.getClients().subscribe({
      next: async (response: any) => {
        const {data} = response;
        this.clients = [{ clientName: 'Create one', clientId: 0 }, ...data];
        this.loading = false;
      },
      error: async (err) => {
        const {error} = err;
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error
        });
      }
    });
  }

  async getProjectSkills(id: number) {
    this.loading = true;
    this.projectSkillService.getProjectSkill(id).subscribe({
      next: async (response: any) => {
        const { data } = response;
        if (data) {
          const { skills } = data;
          this.projectSkills = skills;

          this.dataForm.get('projectSkills')?.setValue(this.projectSkills);
          this.dataForm.get('projectSkills')?.updateValueAndValidity();
        }
        this.loading = false;
      },
      error: async (err) => {
        this.loading = false;
        const { error } = err;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error
        });
      }
    });
  }
  

  addClientToList(newClient: any) {
    this.clients.splice(1, 0, newClient);
  }

  updateClientInForm(newClient: any) {
    this.dataForm.patchValue({
      clientId: newClient.clientId
    });
  }

  closeClientDialog() {
    this.displayAddClientDialog = false;
  }
  
  onClientChange(event: any) {
    if (event.value === 0) {
      this.displayAddClientDialog = true;
    }
  }
  
  handleClientCreated(newClient: any) {
    this.addClientToList(newClient);
    this.updateClientInForm(newClient);
    this.closeClientDialog();
  }

  handleSkillsCreated(newSkills: iSkillRating[]) {
    this.projectSkills = [...newSkills];
    this.dataForm.get('projectSkills')?.setValue(this.projectSkills);
    this.dataForm.get('projectSkills')?.updateValueAndValidity();
  }

  async getStatus() {
    this.loading = true;
    this.statusService.getByType("Projects").subscribe({
      next: async (response: any) => {
        const {data} = response;
        this.status = data;
        this.loading = false;
      },
      error: async (err) => {
        const {error} = err;
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error
        });
      }
    });    
  }

  isFieldInvalid(field: string): boolean {
    const control = this.dataForm.get(field);
    return control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(field: string): string {
    const control = this.dataForm.get(field);

    if (control?.hasError('required')) {
      return `${this.getFieldName(field)} is required.`;
    }

    if (control?.hasError('pattern')) {
      return `${this.getFieldName(field)} must be a valid number greater than 0.`;
    }

    return `${this.getFieldName(field)} is invalid.`;
  }
  
  getFieldName(field: string): string {
    const fieldNames: { [key: string]: string } = {
      projectName: 'Project Name',
      clientId: 'Client',
      projectDescription: 'Project Description',
      numberPositionTobeFill: 'Number of Positions',
      startDate: 'Start Date',
      endDate: 'End Date',
    };

    return fieldNames[field] || field;
  }

  dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = control.get('startDate')?.value;
    const endDate = control.get('endDate')?.value;

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      return { dateRangeInvalid: true };
    }
    return null;
  }

  projectSkillsValidator(control: AbstractControl): ValidationErrors | null {
    if (this.projectSkills && Array.isArray(this.projectSkills) && this.projectSkills.length === 0) {
      return { projectSkillsRequired: true };
    }
    return null;
  }

  async ngOnInit(): Promise<void> {
    this.dataForm = this.fb.group({
      folio: [null],
      projectId: [0],
      projectName: [null, Validators.required],
      clientId: [null, Validators.required],
      projectDescription: [null, Validators.required],
      numberPositionTobeFill: [null, [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      statusId: [1],
      projectSkills: [this.projectSkills]
    }, {
      validators: [this.dateRangeValidator.bind(this)]
    });
  
    this.getClients();
    this.getStatus();
  
    this.dataForm.get('clientId')?.markAsTouched();
  
    this.route.paramMap.subscribe(async params => {
      const id = params.get('id');
      if (id != null) {
        this.id = +id;
        await this.getProject(this.id);
        await this.getProjectSkills(this.id);
  
        // Una vez que los skills se hayan cargado, aplica el validador del form
        this.dataForm.setValidators([this.dateRangeValidator.bind(this), this.projectSkillsValidator.bind(this)]);
        this.dataForm.updateValueAndValidity();
      }
    });
  }

  onCreateClient(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.displayAddClientDialog = true;
  }
}
