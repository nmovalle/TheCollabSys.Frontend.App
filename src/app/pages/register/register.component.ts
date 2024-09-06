import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@app/core/service/user.service';
import { MessageService } from 'primeng/api';
import { InvitationService } from '../config/invitation/invitation.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  loading: boolean = false;
  email!: string;

  constructor(
    private userService: UserService,
    private invitationService: InvitationService,
    private messageService: MessageService,
    public router: Router
  ) {
    
  }

  async sendRequest(): Promise<void> {
    if (!this.email) {
      this.messageService.add({severity:'error', summary:'Error', detail:'Email field is required'});
      return;
    }
    this.loading = true;
    this.invitationService.request(this.email).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Your request to join Collabsys has been sent to our support team. We will reach out to you shortly.'
        });
      },
      error: () => {
        this.loading = false;
        this.messageService.add({severity:'error', summary:'Error', detail:'An error was ocurred while sending the invitation request.'});
      }
    });

    

    // this.userService.register(user).subscribe({
    //   next: (response: any) => {
    //     this.loading = false;
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Success',
    //       detail: 'The user was successfully registered'
    //     });
    //     this.router.navigate(['/']);
    //   },
    //   error: () => {
    //     this.loading = false;
    //     this.messageService.add({severity:'error', summary:'Error', detail:'An error was ocurred while registering the user'});
    //   }
    // });
  }
}
