import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/core/guards/auth.service';
import { Role } from '@app/core/interfaces/role';
import { RoleService } from '@app/core/service/role.service';
import { MessageService } from 'primeng/api';
import { UserRoleService } from '../user-role.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {
  loading: boolean = false;
  id: string | null = null;
  dataForm!: FormGroup;

  imagenURL: string = null;

  roles!: Role[];
  userRole: string = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private roleService: RoleService,
    private authService: AuthService,
    private userRoleService: UserRoleService
  ) {
    const user = this.authService.getUserRole();
    const {roleName} = user;
    this.userRole = roleName;
  }
  
  async getRoles() {
    this.roleService.getRoles().subscribe({
      next: async (response: any) => {
        const {data} = response;
        this.roles = data;
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

  async getUser(id: string) {
    this.userRoleService.getUserRole(id).subscribe({
      next: async (response: any) => {
        if (response) {
          const { status, data, message } = response;
          if (status == 'success') {
            this.dataForm.patchValue(data);
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
            detail: 'An error occurred while getting the user role.'
          });
        }
      },
      error: async (err) => {
        const {error} = err;
        this.loading = false;
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
      this.userRoleService.update(this.id, data, null).subscribe({
        next: async (response: any) => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Record was successfully updated.'
          });
          this.router.navigate(['/user/role'], { replaceUrl: true });
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

  async ngOnInit(): Promise<void> {
    this.dataForm = this.fb.group({
      userId: ['', Validators.required],
      email: [''],
      roleId: ['', Validators.required],
    });

    this.route.paramMap.subscribe(async params => {
      const id = params.get('id');
      if (id != null) {
        this.id = id;
        await this.getUser(this.id);
      }
    });

    await this.getRoles();
  }
}
