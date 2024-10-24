import { Component, OnInit } from '@angular/core';
import { EngineerService } from '../engineer.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from '@app/core/guards/auth.service';
import { Router } from '@angular/router';
import { expandedRows } from '@app/pages/project-skill/list/list.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
  deleteEngineerDialog: boolean = false;
  deleteEngineersDialog: boolean = false;

  engineerSkills!: any[];
  engineers!: any[];
  engineer = {} as any;
  selectedEngineers: any[];
  
  cols: any[] = [];
  colsDetail: any[] = [];

  expandedRows: expandedRows = {};
  isExpanded: boolean = false;
  
  permissions: {};
  userRole: string = null;
  engineerRole = ['ENGINEER'];
  constructor(
    private engineerService: EngineerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private router: Router
  ) {
    const user = this.authService.getUserRole();
    const {roleName} = user;
    this.userRole = roleName;

    this.cols = [
      { field: 'employerName', header: 'Member' },
      { field: 'firstName', header: 'First Name' },
      { field: 'lastName', header: 'Last Name' },
      { field: 'phone', header: 'Phone' },
      { field: 'email', header: 'Email' },
      { field: 'dateCreated', header: 'Date Created' },
      { field: 'dateUpdate', header: 'Date Updated' },
      { field: 'isActive', header: 'Active' },
    ];

    this.colsDetail = [
      { field: 'skillName', header: 'Skill Name' },
      { field: 'levelId', header: 'Level' },
    ]
    this.permissions = this.authService.getPermissions(this.router.url);
  }

  deleteSelectedEngineers() {
    this.deleteEngineersDialog = true;
  }

  confirmDelete(id?: number): void {
    const hdr = "Confirm"
    let msg = "Are you sure you want to delete this record?"

    if(!id && this.selectedEngineers.length > 0) {
      msg = "Are you sure you want to delete these records?"
    }

    this.confirmationService.confirm({
      header: hdr,
      message: msg,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteEngineer(id);
      },
      reject: () => {
      }
    });
  }

  deleteEngineer(engineerId: number) {
    this.deleteEngineerDialog = true;
    this.engineerService.deleteEngineer(engineerId).subscribe({
      next: async () => {
        this.engineers = this.engineers.filter(c => c.engineerId !== engineerId);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The engineer was successfully removed'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error deleting the engineer'
        });
      },
      complete: () => {
        this.deleteEngineerDialog = false;
      }
    });
  }

  getEngineers() {
    const normalizedUserRole = this.userRole.toUpperCase();
    let username=null;
    if (normalizedUserRole === this.engineerRole[0]) { //ENGINEER
      username = this.authService.getUsername();
    }

    this.engineerService.getEngineersDetail(username).subscribe({
      next: (response: any) => {
        const {data} = response;
        this.engineerSkills = data;
      },
      error: (ex) => {
        const {error} = ex;
        this.messageService.add({
          severity: 'info',
          summary: 'Not Found',
          detail: error.message
        });
      }
    });
  }

  ngOnInit() {
    this.getEngineers();
  }

  expandAll() {
    if (!this.isExpanded) {
        this.engineerSkills.forEach(p => p && p.engineerId ? this.expandedRows[p.engineerId] = true : '');

    } else {
        this.expandedRows = {};
    }
    this.isExpanded = !this.isExpanded;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
