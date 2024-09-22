import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

  clients!: Client[];
  displayAddClientDialog: boolean = false;

  projectSkills: iSkillRating[] = [];

  projectSavedId: number = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private projectService: ProjectService,
    private projectSkillService: ProjectSkillService,
    private clientService: ClientService,
    private loadingService: LoadingService,
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

  async onSubmit(event): Promise<void> {
    event.preventDefault();

    this.loading = false;
    if (this.dataForm.valid) {
      const data = this.dataForm.value;

      await this.saveProject(data);
      await this.saveProjectSkills();

      this.router.navigate(['/projects'], { replaceUrl: true });

      this.loading = false;
      
    } else {
      this.loading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'The form is not valid. Please fill the required fields.'
      });
    }
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


  getClients() {
    this.loading = true;
    this.clientService.getClients().subscribe({
      next: async (response: any) => {
        const {data} = response;
        this.clients = [...data, { clientName: 'Create one', clientId: 0 }];
        this.loading = false;
      },
      error: (err) => {
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

  addClientToList(newClient: any) {
    this.clients.splice(this.clients.length - 1, 0, newClient);
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
      numberPositionTobeFill: [null, [Validators.required, Validators.pattern('[0-9]')]],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      statusId: [1],
      dateCreated: [null],
      dateUpdate: [null],
      userId: [null]
    });

    this.dataForm.get('clientId')?.markAsTouched();
    this.getClients();
  }
}
