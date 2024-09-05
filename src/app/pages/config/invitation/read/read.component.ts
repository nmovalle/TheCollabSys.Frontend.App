import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { InvitationService } from '../invitation.service';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrl: './read.component.scss'
})
export class ReadComponent implements OnInit {
  loading: boolean = false;
  id: number | null = null;
  dataForm!: FormGroup;
  imageURL: string = null;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private invitationService: InvitationService
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

  get statusName() {
    return this.dataForm.get('statusName') as FormControl;
  }

  get token() {
    return this.dataForm.get('token') as FormControl;
  }

  getInvitation(id: number) {
    this.invitationService.getInvitation(id).subscribe({
      next: async (response: any) => {
        if (response) {
          console.log(response)
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

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      email: [''],
      domain: [''],
      token: [''],
      expirationDate: [''],
      status: [''],
      statusName: [''],
      roleId: [null],
      isExternal: [false],
      isBlackList: [false],
      roleName: [''],
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id != null) {
        this.id = +id;
        this.getInvitation(this.id);
      }
    });
  }
}
