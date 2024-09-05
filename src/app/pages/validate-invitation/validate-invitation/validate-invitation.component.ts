import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InvitationService } from '@app/pages/config/invitation/invitation.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-validate-invitation',
  templateUrl: './validate-invitation.component.html',
})
export class ValidateInvitationComponent implements OnInit {
  loading: boolean = false;
  token: string | null = null;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private invitationService: InvitationService
  ) {
  }

  async goTo(url: string): Promise<void> {
    await this.router.navigate([url]);
  }

  async validateToken(): Promise<void> {
    this.loading = true;
    this.invitationService.validate(this.token).subscribe({
      next: async (response: any) => {
        console.log(response);
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'We have sent an email with your access data.'
        });
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error
        });
      }
    });
  }

  async ngOnInit(): Promise<void> {    
    this.route.paramMap.subscribe(async params => {
      this.token = params.get('token');
      console.log('Token:', this.token);
      await this.validateToken();
    });
  }
}
