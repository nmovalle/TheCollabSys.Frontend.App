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

  getClient(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/Clients/GetClientByIdAsync/${id}`);
  }

  addClient(client: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/Clients`, client);
  }

  updateClient(id: number, client: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/api/Clients/${id}`, client);
  }

  deleteClient(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/api/Clients/${id}`);
  }
}
