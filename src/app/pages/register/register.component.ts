import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@app/core/service/user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  loading: boolean = false;
  email!: string;
  password!: string;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    public router: Router
  ) {
    
  }

  register() {
    if (!this.email || !this.password) {
      this.messageService.add({severity:'error', summary:'Error', detail:'Email and Password are required'});
      return;
    }

    this.loading = true;
    const user = {
      userName: this.email,
      email: this.email,
      password: this.password
    };

    this.userService.register(user).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The user was successfully registered'
        });
        this.router.navigate(['/']);
      },
      error: () => {
        this.loading = false;
        this.messageService.add({severity:'error', summary:'Error', detail:'An error was ocurred while registering the user'});
      }
    });
  }
}
