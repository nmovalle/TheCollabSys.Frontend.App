import { Component, OnInit } from '@angular/core';
import { Client } from '../models/client';
import { ClientService } from '../services/client.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ResponseApi } from '@app/core/interfaces/response-api';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  providers: [MessageService]
})
export class ListComponent implements OnInit {
  deleteClentDialog: boolean = false;
  deleteClientsDialog: boolean = false;

  clients!: any[];
  client = {} as any;
  selectedClients: any[];
  
  cols: any[] = [];

  constructor(
    private clientService: ClientService,
    private messageService: MessageService,
  ) {
    this.cols = [
      { field: 'clientID', header: 'ID' },
      { field: 'clientName', header: 'Name' },
      { field: 'address', header: 'Address' },
      { field: 'phone', header: 'Phone' },
      { field: 'email', header: 'Email' },
      { field: 'dateCreated', header: 'Date Created' },
      { field: 'dateUpdate', header: 'Date Updated' },
      { field: 'active', header: 'Active' },
    ];
  }

  deleteSelectedClients() {
    this.deleteClientsDialog = true;
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
      next: (response: ResponseApi) => {
        const {data} = response;
        console.log(data)
        this.clients = response.data;
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
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
