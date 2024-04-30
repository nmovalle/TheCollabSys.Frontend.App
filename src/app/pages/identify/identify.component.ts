import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@app/core/service/user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-identify',
  templateUrl: './identify.component.html',
})
export class IdentifyComponent {
  loading: boolean = false;
  email!: string;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    public router: Router
  ) {
    
  }

  identify() {    
    if (!this.email) {
      this.messageService.add({severity:'error', summary:'Error', detail:'Email field is required.'});
      return;
    }

    this.loading = true;
    this.userService.getUserByUserName(this.email).subscribe({
      next: (response: any) => {
        this.loading = false;
        const { id } = response;
        if (id) {
          this.router.navigate([`/forgot/${id}`], { replaceUrl: true });
        } else {
          this.messageService.add({severity:'error', summary:'Error', detail:'The e-mail is not available in the response.'});
        }
      },
      error: () => {
        this.messageService.add({severity:'error', summary:'Error', detail:'An error ocurred while getting user information.'});
        this.loading = false;
      }
    });
  }
}
