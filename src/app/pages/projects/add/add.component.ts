import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ClientService } from '@app/pages/clientes/services/client.service';
import { ProjectService } from '../project.service';
import { Client } from '@app/pages/clientes/models/client';
import { iSkillRating } from '@app/core/components/skills/skills.component';
import { LoadingService } from '@app/core/guards/loading.service';
import { ProjectSkillService } from '@app/pages/project-skill/project-skill.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
})
export class AddComponent implements OnInit {
  loading: boolean = false;
  dataForm!: FormGroup;

  clients: Client[] = [];;
  displayAddClientDialog: boolean = false;

  projectSkills: iSkillRating[] = [];
  projectSavedId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private projectService: ProjectService,
    private projectSkillService: ProjectSkillService,
    private clientService: ClientService,
    private loadingService: LoadingService,
  ) {}

  // Getters para el formulario
  get projectId() {
    return this.dataForm.get('projectId') as FormControl;
  }

  get projectName() {
    return this.dataForm.get('projectName') as FormControl;
  }

  get clientId() {
    return this.dataForm.get('clientId') as FormControl;
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

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    if (this.dataForm.invalid) {
      Object.keys(this.dataForm.controls).forEach(field => {
        const control = this.dataForm.get(field);
        control?.markAsTouched({ onlySelf: true });

        if (control?.invalid) {
          const errorMessage = this.getErrorMessage(field);
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
          detail: 'Project skills are required. Please add at least one skill.'
        });
      }

      return;
    }

    this.loading = true;
    const data = this.dataForm.value;
    await this.saveProject(data);
    await this.saveProjectSkills();

    this.router.navigate(['/projects'], { replaceUrl: true });
    this.loading = false;
  }

  async saveProject(data: any): Promise<void> {
    this.loading = false;
    return new Promise<void>((resolve, reject) => {
      this.projectService.addProject(data, null).subscribe({
        next: (response: any) => {
          const { data } = response;
          this.projectSavedId = data.projectId;

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'The project was successfully registered.'
          });

          this.loading = false;
          resolve();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while creating the project.'
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
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'The project skills were successfully registered.'
          });
          this.loading = false;
          resolve();
        },
        error: (err) => {
          const { error } = err;
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

  getClients() {
    this.loading = true;
    this.clientService.getClients().subscribe({
      next: (response: any) => {
        const { data } = response;
        this.clients = [{ clientName: 'Create one', clientId: 0 },...data];
        this.loading = false;
      },
      error: (err) => {
        const { status, error } = err;
        this.loading = false;
        if (status === 404) {
          this.clients = [{ clientName: 'Create one', clientId: 0 }];
          this.messageService.add({
            severity: 'info',
            summary: 'Info - Clients',
            detail: error.message
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'An unexpected error occurred.'
          });
        }
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

  ngOnInit(): void {
    this.loadingService.loading$.subscribe(loading => {
      this.loading = loading;
    });

    this.dataForm = this.fb.group({
      projectId: [0],
      projectName: [null, Validators.required],
      clientId: [null, Validators.required],
      projectDescription: [null, Validators.required],
      numberPositionTobeFill: [null, [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      statusId: [1],
      dateCreated: [null],
      dateUpdate: [null],
      userId: [null],
      projectSkills: [this.projectSkills]
    }, {
      validators: [this.dateRangeValidator, this.projectSkillsValidator.bind(this)]
    });

    this.dataForm.get('clientId')?.markAsTouched();
    this.getClients();
  }

  onCreateClient(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.displayAddClientDialog = true;
  }
}
