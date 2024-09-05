import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '@app/core/interfaces/role';
import { MessageService } from 'primeng/api';
import { InvitationService } from '../invitation.service';
import { RoleService } from '@app/core/service/role.service';

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
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private invitationService: InvitationService,
    private roleService: RoleService
  ) {
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

  get roleId() {
    return this.dataForm.get('roleId') as FormControl;
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
        this.roles = response;
        console.log(this.roles);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error getting roles'
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
            console.log(data)
            this.dataForm.patchValue({
              ...data,
              roleId: data.roleId
            });
            this.roleId.setValue(data.roleId);
            console.log(JSON.stringify(this.dataForm.value))
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
