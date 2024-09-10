import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, MenuError } from '@app/core/guards/auth.service';
import { GoogleApiService } from '@app/core/guards/google-api.service';
import { MenuRoleDetailDTO } from '@app/core/interfaces/menu';
import { ProposalRole, Role } from '@app/core/interfaces/role';
import { RoleService } from '@app/core/service/role.service';
import { UserService } from '@app/core/service/user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html'
})
export class GuestComponent implements OnInit {
  loading: boolean = false;

  proposaleRoles!: ProposalRole[];
  selectedProposaleRole: any = null;
  roles!: Role[];
  originalRoles: Role[] = [];
  selectedRole: any = null;

  userLogged: any;

  constructor(
    private roleService: RoleService,
    private userService: UserService,
    private messageService: MessageService,
    private googleService: GoogleApiService,
    private authService: AuthService,
    private router: Router,
  ) {
    
  }

  isProposalRoleDisabled(): boolean {
    return this.selectedProposaleRole && this.selectedProposaleRole.proposalId == 0;
  }

  isNextButtonDisabled(): boolean {
    return (!this.selectedProposaleRole || this.selectedProposaleRole.proposalId == 0) ||
           (!this.selectedRole || this.selectedRole.id == 0);
  }

  getProposalRoles() {
    this.roleService.getProposalRoles().subscribe({
      next: (response: any) => {
        this.proposaleRoles = [{ proposalId:0, proposalName: "Select a proposal role" }, ...response];
        this.selectedProposaleRole = this.proposaleRoles[0];
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error getting proposal roles'
        });
      }
    });
  }

  getRoles() {
    this.roleService.getRoles().subscribe({
      next: (response: any) => {
        this.roles = [{ id: 0, name: "Select a role" }, ...response];
        this.originalRoles = [...response];
        this.selectedRole = this.roles[0];
        
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

  async updateUserRole(username: string, newRoleId: string) {
    this.loading = true;
    this.userService.updateUserRole(username, newRoleId).subscribe({
      next: async (response: any) => {
        const { userRole, authToken } = response;
        const { accessToken, refreshToken, accessTokenExpiration } = authToken;

        this.authService.setAccessToken(accessToken);
        this.authService.setRefreshToken(refreshToken);
        this.authService.setAccessTokenExpiration(accessTokenExpiration);
        this.authService.setUserRole(userRole);

        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The user role was successfully updated'
        });

        await this.getUserMenu(username);
      },
      error: async () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error updating user role'
        });
      }
    });
  }

  async getUserMenu(username: string): Promise<void> {
    this.authService.getUserMenu(username).subscribe({
      next: async (response: any) => {
        if ((response as MenuError).error) {
          console.error('Error en menu:', (response as MenuError).message);
          return;
        }
        const userMenu = response as MenuRoleDetailDTO[];
        this.authService.setUsermenu(userMenu);
        this.router.navigate(['home'], { replaceUrl: true });
      },
      error: async () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error getting the user menu'
        });
      }
    });
  }

  onProposaleRoleChange() {
    if (this.selectedProposaleRole) {
      if (this.selectedProposaleRole.proposalId == 0) {
        this.roles = [{ id: '0', name: "Select a role", normalizedName: "Select a role" }, ...this.originalRoles];
        this.selectedRole = this.roles[0];
      } else {
          const { roleId } = this.selectedProposaleRole;
          this.roles = this.originalRoles.filter(role => role.id === roleId);
          if (this.roles.length > 0) {
              this.selectedRole = this.roles[0];
          } else {
              this.roles = [{ id: '0', name: 'No roles found', normalizedName: 'No roles found' }];
              this.selectedRole = this.roles[0];
          }
      }
    }
  }

  onNextButtonClick() {
    const email = this.userLogged;
    const { id } = this.selectedRole;
    this.updateUserRole(email, id);
  }

  logout() {
    const authProvider = this.authService.getAuthProvider();
      switch (authProvider) {
        case "Google":
          this.googleService.logout();
          break;
        default:
          break;
      }

      this.authService.logout();
      this.router.navigate(['/'], { replaceUrl: true });
  }

  ngOnInit(): void {
    this.getRoles();
    this.getProposalRoles();

    this.userLogged = this.authService.getUsername();
  }
}
