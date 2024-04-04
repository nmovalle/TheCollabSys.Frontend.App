import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Client } from '../models/client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(
    private http: HttpClient
  ) { }

  getClients(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/Clients/GetAllClientsAsync`);
  }

  deleteClient(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/api/Clients/${id}`);
  }
}
