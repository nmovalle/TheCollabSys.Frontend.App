import { Component, OnInit } from '@angular/core';
import { Client } from '../models/client';
import { ClientService } from '../services/client.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { GoogleApiService } from '@app/core/guards/google-api.service';

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
    private googleService: GoogleApiService
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

  openNew() {
    this.client = {};
    this.submitted = false;
    this.clientDialog = true;
  }

  deleteSelectedClients() {
    this.deleteClientsDialog = true;
  }

  editProduct(client: Client) {
    this.client = { ...client };
    this.clientDialog = true;
  }

  deleteClient(client: Client) {
    const { clientID } = client;
    this.deleteClentDialog = true;
    this.clientService.deleteClient(clientID).subscribe({
      next: () => {
        this.clients = this.clients.filter(c => c.clientID !== clientID);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The customer was successfully removed'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error deleting the customer'
        });
      },
      complete: () => {
        this.deleteClentDialog = false;
      }
    });
    
  }

  getClients() {
    this.clientService.getClients().subscribe({
      next: (response: any) => {
        this.clients = response;
        console.log(this.clients);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was an error getting the customer'
        });
      }
    });    
  }

  ngOnInit() {
    this.getClients();
    const profile = this.googleService.getProfile();
    console.log(profile);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
