import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EngineerService } from '../engineer.service';
import { iSkillRating } from '@app/core/components/skills/skills.component';
import { EngineerSkillService } from '@app/pages/engineer-skill/engineer-skill.service';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
})
export class ReadComponent implements OnInit {
  loading: boolean = false;
  id: number | null = null;
  dataForm!: FormGroup;
  imageURL: string = null;

  targetSkills: iSkillRating[] = [];
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private engineerService: EngineerService,
    private engineersSkillsService: EngineerSkillService
  ) {
  }

  get engineerId() {
    return this.dataForm.get('engineerId') as FormControl;
  }

  get engineerName() {
    return this.dataForm.get('engineerName') as FormControl;
  }

  get firstName() {
    return this.dataForm.get('firstName') as FormControl;
  }

  get lastName() {
    return this.dataForm.get('lastName') as FormControl;
  }

  get email() {
    return this.dataForm.get('email') as FormControl;
  }

  get phone() {
    return this.dataForm.get('phone') as FormControl;
  }

  get isActive() {
    return this.dataForm.get('isActive') as FormControl;
  }

  get image() {
    return this.dataForm.get('image') as FormControl;
  }

  get filetype() {
    return this.dataForm.get('filetype') as FormControl;
  }

  getEngineer(id: number) {
    this.engineerService.getEngineer(id).subscribe({
      next: async (response: any) => {
        if (response) {
          const { status, data, message } = response;
          if (status == 'success') {
            this.dataForm.patchValue(data);
            this.renderImage();
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
            detail: 'An error occurred while getting the engineer.'
          });
        }
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while getting the engineer.'
        });
      }
    });
  }

  async getSkills(engineerId: number) {
    this.loading = true;
    this.engineersSkillsService.getEngineerSkill(engineerId).subscribe({
      next: (response: any) => {
        const { data } = response;
        if (data) {

          const { skills } = data;
          this.targetSkills = skills;
        }

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
  
  renderImage() {
    const { filetype, image } = this;
    this.imageURL = filetype.value && image.value ? `data:${filetype.value};base64,${image.value}` : null;
  }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      engineerName: [''],
      employerId: [''],
      employerName: [''],
      firstName: [''],
      lastName: [''],
      email: [''],
      phone: [''],
      isActive: [true],
      image: [null],
      filetype: [null],
      dateCreated: [null],
      dateUpdate: [null],
      userId: [null]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) {
        this.id = +id;
        this.getEngineer(this.id);
        this.getSkills(this.id);
      }
    });
  }
}
