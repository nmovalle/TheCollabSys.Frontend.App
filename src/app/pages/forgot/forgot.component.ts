import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@app/core/service/user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html'
})
export class ForgotComponent implements OnInit {
  loading: boolean = false;

  id!: string;
  password!: string;
  confirmPassword!: string;
  
  constructor(
    private userService: UserService,
    private messageService: MessageService,
    public router: Router,
    private route: ActivatedRoute
  ) {
    
  }

  resetPassword() {
    if (!this.password || !this.confirmPassword) {
      this.messageService.add({severity:'error', summary:'Error', detail:'Please fill in both password fields'});
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.messageService.add({severity:'error', summary:'Error', detail:'Passwords do not match'});
      return;
    }

    this.loading = true;
    const updatePassword = {
      id: this.id,
      newPassword: this.password
    };
    this.userService.updatePassword(updatePassword).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.router.navigate(['/'], { replaceUrl: true });
      },
      error: () => {
        this.loading = false;
        this.messageService.add({severity:'error', summary:'Error', detail:'An error was ocurred while updating password.'});
      }
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) this.id = id;
    });
  }
}
