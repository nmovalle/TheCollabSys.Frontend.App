import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '@app/core/interfaces/role';
import { MessageService } from 'primeng/api';
import { InvitationService } from '../invitation.service';
import { RoleService } from '@app/core/service/role.service';
import { AuthService } from '@app/core/guards/auth.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit {
  loading: boolean = false;
  id: number | null = null;
  dataForm!: FormGroup;

  imagenURL: string = null;

  roles!: Role[];
  allowedRoles = ['SUPERADMIN', 'MEMBEROWNER', 'ENGINEER', 'MEMBERSUPERVISOR', 'FREELANCE', 'GUEST'];
  userRole: string = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private invitationService: InvitationService,
    private roleService: RoleService,
    private authService: AuthService
  ) {
    const user = this.authService.getUserRole();
    const {roleName} = user;
    this.userRole = roleName;
  }

  get email() {
    return this.dataForm.get('email') as FormControl;
  }

  get domain() {
    return this.dataForm.get('domain') as FormControl;
  }

  get isExternal() {
    return this.dataForm.get('isExternal') as FormControl;
  }

  get isBlackList() {
    return this.dataForm.get('isBlackList') as FormControl;
  }

  get expirationDate() {
    return this.dataForm.get('expirationDate') as FormControl;
  }

  get status() {
    return this.dataForm.get('status') as FormControl;
  }

  get token() {
    return this.dataForm.get('token') as FormControl;
  }

  async getRoles() {
    this.roleService.getRoles().subscribe({
      next: async (response: any) => {
        const {data} = response;
        let filteredRoles = [];
  
        const normalizedUserRole = this.userRole.toUpperCase();
        if (normalizedUserRole === this.allowedRoles[0]) { //SUPERADMIN
          filteredRoles = data.filter(role => this.allowedRoles.includes(role.normalizedName));
        } 
        else if (normalizedUserRole === this.allowedRoles[1]) { //MEMBEROWNER
          filteredRoles = data.filter(role => 
            role.normalizedName === this.allowedRoles[1] || role.normalizedName === this.allowedRoles[2] || role.normalizedName === this.allowedRoles[3]
          );
        }
        else if (normalizedUserRole === this.allowedRoles[3]) { //MEMBERSUPERVISOR
          filteredRoles = data.filter(role => 
            role.normalizedName === this.allowedRoles[2] || role.normalizedName === this.allowedRoles[3]
          );
        } 
  
        this.roles = filteredRoles;
      },
      error: async (err) => {
        const {error} = err;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error
        });
      }
    });
  }

  onSubmit(event) {
    event.preventDefault();
    if (this.dataForm.valid) {
      const data = this.dataForm.value;

      this.loading = true;
      this.invitationService.generate(data).subscribe({
        next: async (response: any) => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Record was successfully updated.'
          });
          this.router.navigate(['/config/invitations'], { replaceUrl: true });
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

  async getInvitation(id: number) {
    this.invitationService.getInvitation(id).subscribe({
      next: async (response: any) => {
        if (response) {
          const { status, data, message } = response;
          if (status == 'success') {
            console.log("data: ",JSON.stringify(data));
            this.dataForm.patchValue({
              ...data,
              roleId: String(data.roleId), // Aseguramos que el roleId sea un string
            });
            
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
            detail: 'An error occurred while getting the invitation.'
          });
        }
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while getting the invitation.'
        });
      }
    });
  }

  onEmailInput(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    const atIndex = inputValue.indexOf('@');
    
    if (atIndex !== -1) {
      const domainPart = inputValue.split('@')[1];
      if (domainPart) {
        this.dataForm.patchValue({ domain: domainPart });
      } else {
        this.dataForm.patchValue({ domain: '' });
      }
    } else {
      this.dataForm.patchValue({ domain: '' });
    }
  }

  async ngOnInit(): Promise<void> {
    this.dataForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      domain: [''],
      roleId: ['', Validators.required],
      isExternal: [false, Validators.required],
      isBlackList: [false, Validators.required],
    });

    this.route.paramMap.subscribe(async params => {
      const id = params.get('id');
      if (id != null) {
        this.id = +id;
        await this.getInvitation(this.id);
      }
    });

    await this.getRoles();
  }
}
