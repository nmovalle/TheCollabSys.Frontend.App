import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SkillService } from '../skill.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
})
export class AddComponent {
  loading: boolean = false;
  skillForm!: FormGroup;

  selectedFile: File | null = null;
  imageURL: string = null;

  constructor(
    private fb: FormBuilder,
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

      this.loading = true;
      this.skillService.addSkill(data, this.selectedFile).subscribe({
        next: (response: any) => {
          console.log(response)
          if (response) {
            this.loading = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Record was successfully added.'
            });
            this.router.navigate(['/skills'], { replaceUrl: true });
          } else {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'An error occurred while adding the record.'
            });
          }
        },
        error: () => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while adding the record.'
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

  ngOnInit(): void {
    this.skillForm = this.fb.group({
      skillName: ['', Validators.required],
    });
  }
}
