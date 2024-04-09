import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from '../services/client.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  providers: [MessageService],
})

export class EditComponent implements OnInit {
   clientDialog: boolean = false;
   submitted: boolean = false;
   id: string | null = null;
   client: any = null;


  // constructor(private route: ActivatedRoute) {}
  clients: any[] = [];
  selectedClient: any = null;

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private messageService: MessageService,
    private router: Router // Inject the Router service
  ) {}
  ngOnInit(): void { 
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.getClientById(this.id);
    }   
  }

  updateClient() {
    this.submitted = true;

    if (this.client.clientID) {
      this.clientService.updateClient(this.client.clientID, this.client).subscribe({
        next: () => {
          this.clients = this.clients.map(c => {
            if (c.clientID === this.client.clientID) {
              return this.client;
            }
            return c;
          });
          this.clientDialog = false;
          this.client = {};
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Client updated successfully'
          });
          this.router.navigate(['/clients']);
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error updating client'
          });
        }
      });
    }
  }

  getClientById(id: string): void {
    this.clientService.getClientsById(id).subscribe({
      next: (client: any) => {
        this.client = client;
        console.log(client);
      },
      error: (error) => {
        console.error('There was an error getting the client details', error);
      }
    });      


  }

}



