import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
})
export class ReadComponent {
  loading: boolean = false;
  id: number | null = null;
  dataForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private projectService: ProjectService
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

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      projectId: [0],
      projectName: [null],
      clientId: [null],
      clientName: [null],
      projectDescription: [null],
      numberPositionTobeFill: [null],
      startDate: [null],
      endDate: [null],
      statusId: [null],
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
  }
}
