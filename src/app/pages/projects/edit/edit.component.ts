import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  loading: boolean = false;
  id: number | null = null;
  dataForm!: FormGroup;

  clients!: Client[];
  displayAddClientDialog: boolean = false;

  status!: StatusDTO[];
  projectSavedId: number = null;
  

  projectSkills: iSkillRating[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private projectService: ProjectService,
    private clientService: ClientService,
    private statusServie: StatusService,
    private projectSkillService: ProjectSkillService
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
    this.loading = true;
    event.preventDefault();

    debugger;
    if (this.dataForm.valid) {
      const data = this.dataForm.value;
      data.projectId = this.id;

      await this.saveProject(data.projectId, data);
      await this.saveProjectSkills();

      this.loading = false;
      this.router.navigate(['/projects'], { replaceUrl: true });
      
    } else {
      this.loading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'The form is not valid. Please fill the required fields.'
      });
    }
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
        this.clients = [...data, { clientName: 'Create one', clientId: 0 }];
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
    console.log("skill recibido:", newSkills)
    this.projectSkills = [...newSkills];
  }

  async getStatus() {
    this.loading = true;
    this.statusServie.getByType("Projects").subscribe({
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

  async ngOnInit(): Promise<void> {
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

    this.getClients();
    this.getStatus();

    this.dataForm.get('clientId')?.markAsTouched();

    this.route.paramMap.subscribe(async params => {
      const id = params.get('id');
      if (id != null) {
        this.id = +id;
        await this.getProject(this.id);
        await this.getProjectSkills(this.id);
      }
    });
  }
}
