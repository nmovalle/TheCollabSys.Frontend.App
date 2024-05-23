import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SkillService } from '../skill.service';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
})
export class ReadComponent {
  loading: boolean = false;
  id: number | null = null;
  imageURL: string = null;
  skillForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private skillService: SkillService
  ) {
    
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

  ngOnInit(): void {
    this.skillForm = this.fb.group({
      skillName: [''],
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
