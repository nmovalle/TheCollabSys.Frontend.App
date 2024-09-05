import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, MenuError } from '@app/core/guards/auth.service';
import { MessageService } from 'primeng/api';
import { RegisterDomainService } from '../register-domain.service';
import { UserService } from '@app/core/service/user.service';
import { LoadingService } from '@app/core/guards/loading.service';
import { forkJoin } from 'rxjs';
import { MenuRoleDetailDTO } from '@app/core/interfaces/menu';
import { AuthFlowService } from '@app/core/guards/auth-flow.service';

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
})
export class DomainComponent implements OnInit {
  loading = false;
  showContent = false;
  thereDomain = false;

  domainId: number;
  userId!: string;
  company!: string;
  domainCompanyId!: number;
  userCompanyId!: number;

  email!: string;
  domain!: string;

  dataForm!: FormGroup;
  selectedFile: File | null = null;
  imageURL: string = null;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private userService: UserService,
    private authService: AuthService,
    private domainSerice: RegisterDomainService,
    private loadingService: LoadingService,
    private router: Router,
    private authFlowService: AuthFlowService
  ) {}

  get companyId() {
    return this.dataForm.get('companyId') as FormControl;
  }

  get domainMasterId() {
    return this.dataForm.get('domainMasterId') as FormControl;
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

  get logo() {
    return this.dataForm.get('logo') as FormControl;
  }

  get fileType() {
    return this.dataForm.get('fileType') as FormControl;
  }

  get active() {
    return this.dataForm.get('active') as FormControl;
  }

  async ngOnInit(): Promise<void> {
    this.initialFormGroup();
    this.initializeEmailFromState();

    await this.registerUser();
    const existDomain = await this.existsDomain();
    await this.getCompany();
    await this.getUserCompanyByUserId();
    this.thereDomain = existDomain;
    this.showContent = true;

    console.log('existDomain:',existDomain);
    console.log('userId:',this.userId);
    console.log('domainId:',this.domainId);
    console.log('domainCompanyId:',this.domainCompanyId);
    console.log('userCompanyId:',this.userCompanyId);
  }

  private initializeEmailFromState(): void {
    const state = window.history.state as { email?: string; domain?: string; userId?: string };
    this.email = state?.email || '';
    this.domain = state?.domain || '';
    this.userId = state?.userId || '';
  }

  private initialFormGroup(): void {
    this.dataForm = this.fb.group({
      companyId: [0],
      domainmasterId: [0],
      fullName: [null, Validators.required],
      address: [null, Validators.required],
      zipCode: [null, [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      active: [true, [Validators.required]]
    });
  }

  public onUpload(event: any, fileUpload) {
    this.selectedFile = event.files[0];
    this.renderImage();
    fileUpload.clear();
  }
  
  private renderImage() {
    this.imageURL = URL.createObjectURL(this.selectedFile);
  }

  async goTo(url: string, state?: any): Promise<void> {
    if (state) {
      await this.router.navigate([url], { state });
    } else {
      await this.router.navigate([url]);
    }
  }

  async existsDomain(): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      this.loading = true;
      try {
        const response: any = await this.domainSerice.getByDomain(this.domain).toPromise();
        const { data } = response;
        this.company = data.fullName;
        this.domain = data.domain;
        this.domainId = data.id;
  
        if (response?.status === 'success') {
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (err) {
        resolve(false);
      } finally {
        this.loading = false;
      }
    });
  }

  async getCompany(): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      this.loading = true;
      try {
        const response: any = await this.domainSerice.getCompanyByDomain(this.domain).toPromise();
        const { data } = response;

        this.domainCompanyId = data.companyId;
        
        if (response?.status === 'success') {
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (err) {
        resolve(false);
      } finally {
        this.loading = false;
      }
    });
  }

  async getUserCompanyByUserId(): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      this.loading = true;
      try {
        const response: any = await this.domainSerice.getUserCompanyByUserId(this.userId).toPromise();
        const { data } = response;

        this.userCompanyId = data.userCompayId;
        
        if (response?.status === 'success') {
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (err) {
        resolve(false);
      } finally {
        this.loading = false;
      }
    });
  }

  public async registerUser(): Promise<void> {
    this.loading = true;
    const user = {
      userName: this.email,
      email: this.email,
    };

    this.userService.simpleRegister(user).subscribe({
      next: async (response: any) => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The user was successfully registered'
        });

        console.log(response);
        this.userId = response.id;
      },
      error: async () => {
        this.loading = false;
        this.messageService.add({severity:'error', summary:'Error', detail:'An error was ocurred while creating the user'});
      }
    });
  }

  public async registerDomainMaster(): Promise<void> {
    this.loading = true;
    const data = this.dataForm.value;
    const domain = {
      domain: this.domain,
      fullName: data.fullName,
      active: true
    };
  
    return new Promise<void>((resolve, reject) => {
      this.domainSerice.createDomain(domain, null).subscribe({
        next: (response: any) => {
          console.log(response);
          const { data } = response;
          this.domainId = data.id;
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
  
  public async createCompany(data: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.domainSerice.createCompany(data, this.selectedFile).subscribe({
        next: (response: any) => {
          const { data } = response;
          this.domainCompanyId = data.companyId;
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

  public async confirmDomain(): Promise<void> {
    await this.createUserCompany();
    this.tokenAuth();
  }

  public async createUserCompany(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const data = {
        userId: this.userId,
        companyId: this.domainCompanyId
      };

      this.domainSerice.createUserCompany(data, null).subscribe({
        next: (response: any) => {
          console.log(response);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'The user company was successfully registered'
          });
          this.loading = false;
          resolve();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while creating the user company.'
          });
          reject();
        },
        complete: () => {
          this.loading = false;
        }
      });
    });
  }  

  public async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.dataForm.valid) {
      if (!this.thereDomain) {
        await this.registerDomainMaster();
      }
  
      this.loading = true;
      try {
        const data = this.dataForm.value;
        data.domainMasterId = this.domainId;

        await this.createCompany(data);
        await this.getCompany();
        await this.createUserCompany();
        this.tokenAuth();
      } catch (error) {
        console.error("Error creating company", error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while creating the company.'
        });
      }
    } else {
      this.loading = false;
      this.dataForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'The form is not valid. Please fill the required fields.'
      });
    }
  }

  startLoading() {
    this.loadingService.setLoading(true);
  }

  stopLoading() {
    this.loadingService.setLoading(false);
  }

  public tokenAuth(): void {
    this.authFlowService.executeAuthFlow(
      () => this.authService.authDomain(this.userId),
      this.email,
      () => this.stopLoading()
    );
  }  
}
