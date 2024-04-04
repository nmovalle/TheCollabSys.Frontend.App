import { Component, OnInit } from '@angular/core';
import { Client } from '../models/client';
import { ClientService } from '../services/client.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { GoogleApiService } from '@app/pages/login/services/google-api.service';

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
      this.deleteClentDialog = true;
  }


  getClients() {
    this.clientService.getClients().subscribe((response: any) => {
      this.clients = response;
      console.log(this.clients)
    }),
    () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al obtener clientes'
      });
    }
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
