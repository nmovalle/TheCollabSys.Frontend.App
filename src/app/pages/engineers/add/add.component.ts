import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EngineerService } from '../engineer.service';
import { Employer } from '@app/pages/employers/models/employer';
import { EmployerService } from '@app/pages/employers/employer.service';
import { iSkillRating } from '@app/core/components/skills/skills.component';
import { EngineerSkillService } from '@app/pages/engineer-skill/engineer-skill.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
})
export class AddComponent implements OnInit {
  loading: boolean = false;
  dataForm!: FormGroup;

  selectedFile: File | null = null;
  imageURL: string = null;

  employers!: Employer[];
  displayAddEmployerDialog: boolean = false;

  engineerSkills: iSkillRating[] = [];
  engineerSavedId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private engineerService: EngineerService,
    private employerService: EmployerService,
    private engineersSkillService: EngineerSkillService,
  ) {
  }

  get engineerId() {
    return this.dataForm.get('engineerId') as FormControl;
  }

  get employerId() {
    return this.dataForm.get('employerId') as FormControl;
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

  async getEmployers() {
    this.loading = true;
    this.employerService.getEmployers().subscribe({
      next: async (response: any) => {
        const {data} = response;
        this.employers = [{ employerName: 'Create one', employerId: 0 }, ...data];
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
  
  async saveEngineer(data: any) {
    return new Promise<void>((resolve, reject) => {
      this.engineerService.addEngineer(data, this.selectedFile).subscribe({
        next: (response: any) => {
          const { data } = response;
          this.engineerSavedId = data.engineerId;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'The project was successfully registered.'
          });

          this.loading = false;
          resolve();          
        },
        error: (err) => {
          const {error} = err;
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error
          });
        },
        complete: () => {
          this.loading = false;
        }
      });
    });
  }

  async saveEngineerSkills(): Promise<void> {
    this.loading = false;
    const data = {
      engineerId: this.engineerSavedId,
      skills: this.engineerSkills
    };
    return new Promise<void>((resolve, reject) => {
      this.engineersSkillService.addEngineerSkill(data, null).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'The engineer skills were successfully registered.'
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

  async onSubmit(event) {
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

      if (this.dataForm.hasError('engineerSkillsRequired')) {
        this.messageService.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: 'Engineer skills are required. Please add at least one skill.'
        });
      }

      return;
    }
    
    this.loading = true;
    const data = this.dataForm.value;
    await this.saveEngineer(data);
    await this.saveEngineerSkills();

    this.router.navigate(['/engineers'], { replaceUrl: true });
    this.loading = false;
  }

  onUpload(event: any, fileUpload) {
    this.selectedFile = event.files[0];
    this.renderImage();
    fileUpload.clear();
  }
  
  renderImage() {
    this.imageURL = URL.createObjectURL(this.selectedFile);
  }

  addEmployerToList(newEmployer: any) {
    this.employers.splice(this.employers.length - 1, 0, newEmployer);
  }

  updateEmployerInForm(newEmployer: any) {
    this.dataForm.patchValue({
      employerId: newEmployer.employerId
    });
  }

  closeEmployerDialog() {
    this.displayAddEmployerDialog = false;
  }

  onEmployerChange(event: any) {
    if (event.value === 0) {
      this.displayAddEmployerDialog = true;
    }
  }

  handleEmployerCreated(newEmployer: any) {    
    this.addEmployerToList(newEmployer);
    this.updateEmployerInForm(newEmployer);
    this.closeEmployerDialog();
  }

  handleSkillsCreated(newSkills: iSkillRating[]) {
    this.engineerSkills = [...newSkills];
    this.dataForm.get('engineerSkills')?.setValue(this.engineerSkills);
    this.dataForm.get('engineerSkills')?.updateValueAndValidity();
  }

  getFieldName(field: string): string {
    const fieldNames: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'First Name',
      employerId: 'Employer',
      email: 'Email',
      phone: 'Phone',
    };

    return fieldNames[field] || field;
  }

  getErrorMessage(field: string): string {
    const control = this.dataForm.get(field);

    if (control?.hasError('required')) {
      return `${this.getFieldName(field)} is required.`;
    }

    if (control?.hasError('pattern')) {
      if (field === 'phone') {
        return `${this.getFieldName(field)} must be a valid phone number.`;
      }
      return `${this.getFieldName(field)} must be a valid number greater than 0.`;
    }

    return `${this.getFieldName(field)} is invalid.`;
  }

  engineerSkillsValidator(control: AbstractControl): ValidationErrors | null {
    if (this.engineerSkills && Array.isArray(this.engineerSkills) && this.engineerSkills.length === 0) {
      return { engineerSkillsRequired: true };
    }
    return null;
  }

  onCreateEmployer(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.displayAddEmployerDialog = true;
  }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      employerId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{0,2}[ -]?(\(?\d{1,3}?\)?)[ -]?\d{3}[ -]?\d{4}$/)]],
      isActive: [true, [Validators.required]],
      engineerSkills: [this.engineerSkills]
    }, {
      validators: [this.engineerSkillsValidator.bind(this)]
    });

    this.dataForm.get('employeerId')?.markAsTouched();
    this.getEmployers();
  }
}
