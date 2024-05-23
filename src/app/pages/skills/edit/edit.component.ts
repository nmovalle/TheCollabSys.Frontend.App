import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SkillService } from '../skill.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent {
  loading: boolean = false;
  id: number | null = null;
  skillForm!: FormGroup;

  selectedFile: File | null = null;
  imageURL: string = null;
  isUpload: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private skillService: SkillService
  ) {
  }

  get skillId() {
    return this.skillForm.get('skillId') as FormControl;
  }

  get skillName() {
    return this.skillForm.get('skillName') as FormControl;
  }

  onSubmit(event) {
    event.preventDefault();
    if (this.skillForm.valid) {
      const data = this.skillForm.value;
      data.skillId = this.id;

      this.loading = true;
      this.skillService.updateSkill(data.skillId, data, this.selectedFile).subscribe({
        next: async (response: any) => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Record was successfully updated.'
          });
          this.router.navigate(['/skills'], { replaceUrl: true });
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

  getSkill(id: number) {
    this.skillService.getSkill(this.id).subscribe({
      next: async (response: any) => {
        if (response) {
          const { status, data, message } = response;
          console.log(data)
          if (status == 'success') {
            this.skillForm.patchValue(data);
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
            detail: 'An error occurred while getting the skill.'
          });
        }
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while getting the skill.'
        });
      }
    });
  }

  onUpload(event: any, fileUpload) {    
    this.isUpload = true;
    this.selectedFile = event.files[0];
    fileUpload.clear();
  }
  
  ngOnInit(): void {
    this.skillForm = this.fb.group({
      skillId: [0],
      skillName: [null, Validators.required],
      
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) {
        this.id = +id;
        this.getSkill(this.id);
      }
    });
  }
}
