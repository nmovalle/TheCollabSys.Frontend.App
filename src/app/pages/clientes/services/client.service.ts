import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
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
   
  getClientsById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/Clients/GetClientByIdAsync/${id}`);
  }

  deleteClient(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/api/Clients/${id}`);
  }

   // Add the updateClient method
  updateClient(clientID: string, client: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/Clients/${clientID}`, client);
  }
}
