
import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from '../services/client.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
})
export class AddComponent {


  client = {
    clientName: '',
    email: '',
    address: '',
    phone: ''
  };
  constructor(private clientService: ClientService) {}
   
  addClient(client: any): void {
    this.clientService.addClient(client).subscribe({
      next: (result) => {
        console.log('Client added successfully', result);
        // Handle successful addition (e.g., navigate or update the view)
      },
      error: (error) => {
        console.log(client);
        console.error('Error adding client', error);
        // Handle error
      }
    });
  }

}
