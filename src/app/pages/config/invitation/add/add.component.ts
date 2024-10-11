import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { InvitationService } from '../invitation.service';
import { RoleService } from '@app/core/service/role.service';
import { Role } from '@app/core/interfaces/role';
import { RegisterDomainService } from '@app/pages/register-domain/register-domain.service';
import { AuthService } from '@app/core/guards/auth.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent implements OnInit {
  loading: boolean = false;
  dataForm!: FormGroup;

  selectedFile: File | null = null;
  imageURL: string = null;

  roles!: Role[];
  allowedRoles = ['SUPERADMIN', 'EMPLOYEROWNER', 'ENGINEER', 'FREELANCE', 'GUEST'];

  thereDomain = false;
  domainMasterId: number = null;
  companyId: number = null;

  userRole: string = null;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private invitationService: InvitationService,
    private roleService: RoleService,
    private domainSerice: RegisterDomainService,
    private authService: AuthService
  ) {
    const user = this.authService.getUserRole();
    const {roleName} = user;
    this.userRole = roleName;
  }

  get id() {
    return this.dataForm.get('id') as FormControl;
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

  get fullName() {
    return this.dataForm.get('fullName') as FormControl;
  }

  get address() {
    return this.dataForm.get('address') as FormControl;
  }

  get zipCode() {
    return this.dataForm.get('zipCode') as FormControl;
  }

  get phone() {
    return this.dataForm.get('phone') as FormControl;
  }

  get active() {
    return this.dataForm.get('active') as FormControl;
  }

  public onUpload(event: any, fileUpload) {
    this.selectedFile = event.files[0];
    this.renderImage();
    fileUpload.clear();
  }
  
  private renderImage() {
    this.imageURL = URL.createObjectURL(this.selectedFile);
  }

  async getRoles() {
    this.roleService.getRoles().subscribe({
      next: async (response: any) => {
        let filteredRoles = [];
  
        if (this.userRole.toUpperCase() === this.allowedRoles[0]) { //SUPERADMIN
          filteredRoles = response.filter(role => this.allowedRoles.includes(role.normalizedName));
        } 
        else if (this.userRole.toUpperCase() === this.allowedRoles[1]) { //EMPLOYEROWNER
          filteredRoles = response.filter(role => 
            role.normalizedName === this.allowedRoles[1] || role.normalizedName === this.allowedRoles[2]
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
  

  async getDomain() {
    this.authService.getDomainByUsername().subscribe({
      next: async (response: any) => {
        const {data} = response;
        this.dataForm.patchValue({
          domain: data.domain
        });
        this.domainMasterId = data.id;
        this.thereDomain = true;
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

  async existsDomain(event: any): Promise<boolean> {
    this.domainMasterId = null;
    const domainValue = event.target.value;
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const response: any = await this.domainSerice.getByDomain(domainValue).toPromise();
        const { data } = response;
        this.domainMasterId = data.id;
        this.thereDomain = true;

        if (response?.status === 'success') {
          resolve(true);
        } else {
          this.thereDomain = false;
          resolve(false);
        }
      } catch (err) {
        this.thereDomain = false;
        resolve(false);
      } finally {
        this.loading = false;
      }
    });
  }

  public async registerDomainMaster(): Promise<void> {
    this.loading = true;
    const data = this.dataForm.value;
    const domain = {
      domain: data.domain,
      fullName: data.fullName,
      active: true
    };
  
    return new Promise<void>((resolve, reject) => {
      this.domainSerice.createDomain(domain, null).subscribe({
        next: (response: any) => {
          console.log(response);
          const { data } = response;
          this.domainMasterId = data.id;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'The domain was successfully registered'
          });
          this.loading = false;
          resolve();
        },
        error: () => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while creating the domain'
          });
          reject();
        }
      });
    });
  }

  public async createCompany(domainMasterId: number): Promise<void> {
    const data = this.dataForm.value;
    const domain = {
      companyId: 0,
      domainMasterId: domainMasterId,
      fullName: data.fullName,
      address: data.address,
      zipCode: data.zipCode,
      phone: data.phone,
      active: true,
    };

    return new Promise<void>((resolve, reject) => {
      this.domainSerice.createCompany(domain, this.selectedFile).subscribe({
        next: (response: any) => {
          const { data } = response;
          this.companyId = data.companyId;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'The company was successfully registered'
          });
          this.loading = false;
          resolve();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while creating the company.'
          });
          reject();
        },
        complete: () => {
          this.loading = false;
        }
      });
    });
  }

  async onSubmit(event): Promise<void> {
    event.preventDefault();
    this.updateFormValidators();
    if (this.dataForm.valid) {
      this.loading = true;
      try {
        if (!this.thereDomain) {
          await this.registerDomainMaster();
          await this.createCompany(this.domainMasterId);
        }
        
        const data = this.dataForm.value;
        this.invitationService.generate(data).subscribe({
          next: (response: any) => {
            if (response) {
              this.loading = false;
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Record was successfully added.'
              });
              this.router.navigate(['/config/invitations'], { replaceUrl: true });
            } else {
              this.loading = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred while adding the record.'
              });
            }
          },
          error: () => {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'An error occurred while adding the record.'
            });
          }
        });
      } catch (error) {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An unexpected error occurred: ' + error.message
        });
      }
    } else {
      this.loading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'The form is not valid. Please fill the required fields.'
      });
    }
  }

  onRoleChange(event: any) {
    const selectedRole = event.value;
    const roleName = this.roles.find(role => role.id === selectedRole)?.normalizedName;
  
    if (roleName === 'EMPLOYEROWNER' || roleName === 'SUPERADMIN') {
      this.dataForm.patchValue({ domain: '' });
      this.domainMasterId = null;
      this.thereDomain = false;
    } else {
      this.getDomain();
    }
  }
  

  updateFormValidators(): void {
    if (this.thereDomain) {
      this.dataForm.get('companyId').clearValidators();
      this.dataForm.get('domainmasterId').clearValidators();
      this.dataForm.get('fullName').clearValidators();
      this.dataForm.get('address').clearValidators();
      this.dataForm.get('zipCode').clearValidators();
      this.dataForm.get('phone').clearValidators();
      this.dataForm.get('active').clearValidators();
    } else {
      this.dataForm.get('companyId').setValidators([Validators.required]);
      this.dataForm.get('domainmasterId').setValidators([Validators.required]);
      this.dataForm.get('fullName').setValidators([Validators.required]);
      this.dataForm.get('address').setValidators([Validators.required]);
      this.dataForm.get('zipCode').setValidators([Validators.required]);
      this.dataForm.get('phone').setValidators([Validators.required, Validators.pattern('[0-9]+')]);
      this.dataForm.get('active').setValidators([Validators.required]);
    }
  
    this.dataForm.get('companyId').updateValueAndValidity();
    this.dataForm.get('domainmasterId').updateValueAndValidity();
    this.dataForm.get('fullName').updateValueAndValidity();
    this.dataForm.get('address').updateValueAndValidity();
    this.dataForm.get('zipCode').updateValueAndValidity();
    this.dataForm.get('phone').updateValueAndValidity();
    this.dataForm.get('active').updateValueAndValidity();
  }
  
  async ngOnInit(): Promise<void> {
    this.dataForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      domain: [''],
      roleId: [null, Validators.required],
      isExternal: [false, Validators.required],
      isBlackList: [false, Validators.required],
      companyId: [0],
      domainmasterId: [0],
      fullName: [null],
      address: [null],
      zipCode: [null],
      phone: ['', [Validators.pattern('[0-9]+')]],
      active: [true]
    });

    this.getDomain();
    this.getRoles();
    this.updateFormValidators();
  }
}
