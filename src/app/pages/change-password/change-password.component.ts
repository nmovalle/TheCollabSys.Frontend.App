import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/core/guards/auth.service';
import { UserService } from '@app/core/service/user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent implements OnInit {
  loading: boolean = false;

  id!: string;
  password!: string;
  confirmPassword!: string;
  
  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private authService: AuthService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) this.id = id;
    });
  }

  // Método para validar la seguridad de la contraseña
  validatePassword(password: string) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return { isValid: false, message: 'Password must be at least 8 characters long.' };
    }
    if (!hasUpperCase) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter.' };
    }
    if (!hasLowerCase) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter.' };
    }
    if (!hasNumbers) {
      return { isValid: false, message: 'Password must contain at least one number.' };
    }
    if (!hasSpecialChars) {
      return { isValid: false, message: 'Password must contain at least one special character.' };
    }

    return { isValid: true, message: '' };
  }

  // Método para resetear la contraseña
  resetPassword() {
    // Verificar que ambos campos estén llenos
    if (!this.password || !this.confirmPassword) {
      this.messageService.add({severity:'error', summary:'Error', detail:'Please fill in both password fields'});
      return;
    }

    // Verificar que las contraseñas coincidan
    if (this.password !== this.confirmPassword) {
      this.messageService.add({severity:'error', summary:'Error', detail:'Passwords do not match'});
      return;
    }

    // Validar la seguridad de la contraseña
    const passwordValidation = this.validatePassword(this.password);
    if (!passwordValidation.isValid) {
      this.messageService.add({severity: 'error', summary: 'Weak Password', detail: passwordValidation.message});
      return;
    }

    // Si todo está bien, proceder a cambiar la contraseña
    this.loading = true;
    const updatePassword = {
      id: this.id,
      newPassword: this.password
    };
    this.userService.updatePassword(updatePassword).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.authService.setChangePasswordConfirmed(false);
        this.router.navigate(['/'], { replaceUrl: true });
      },
      error: () => {
        this.loading = false;
        this.messageService.add({severity:'error', summary:'Error', detail:'An error occurred while updating password.'});
      }
    });
  }
}
