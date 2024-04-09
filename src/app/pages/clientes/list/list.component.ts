import { Component, OnInit } from '@angular/core';
import { Client } from '../models/client';
import { ClientService } from '../services/client.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { GoogleApiService } from '@app/pages/login/services/google-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  providers: [MessageService]
})
export class ListComponent implements OnInit {
  clientDialog: boolean = false;
  deleteClentDialog: boolean = false;
  deleteClientsDialog: boolean = false;

  clients!: any[];
  client = {} as any;
  selectedClients: any[];

  submitted: boolean = false;
  cols: any[] = [];
  statuses: any[] = [];
  rowsPerPageOptions = [5, 10, 20];

  constructor(
    private clientService: ClientService,
    private messageService: MessageService,
    private googleService: GoogleApiService,
    private router: Router
    
  ) {
    this.cols = [
      { field: 'clientID', header: 'ID' },
      { field: 'clientName', header: 'Name' },
      { field: 'address', header: 'Address' },
      { field: 'phone', header: 'Phone' },
      { field: 'email', header: 'Email' },
      { field: 'dateCreated', header: 'Date Created' }
    ];
  }

  ngOnInit() {
    this.getClients();
    const profile = this.googleService.getProfile();
    // console.log(profile);
  }

  getClients() {
    this.clientService.getClients().subscribe({
      next: (response: any) => {
        this.clients = response;        
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error getting the customers'
        });
      }
    });
  }

  openNew() {
    this.client = {};
    this.submitted = false;
    this.clientDialog = true;
  }
  
  deleteClient(client: Client) {
    this.deleteClentDialog = true;
    this.clientService.deleteClient(client.clientID).subscribe({
      next: () => {
        this.clients = this.clients.filter(c => c.clientID !== client.clientID);
        this.deleteClentDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Client deleted successfully'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error deleting client'
        });
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
