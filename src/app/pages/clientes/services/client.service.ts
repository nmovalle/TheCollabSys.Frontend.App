import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ResponseApi } from '@app/core/interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(
    private http: HttpClient
  ) { }

  getClients(): Observable<ResponseApi> {
    return this.http.get<any>(`${environment.apiUrl}/api/Clients`);
  }

  getClient(id: number): Observable<ResponseApi> {
    return this.http.get<any>(`${environment.apiUrl}/api/Clients/${id}`);
  }

  addClient(client: any, file: File): Observable<any> {
    const formData: FormData = new FormData();
    
    if (file)
      formData.append('file', file, file.name);
    
    formData.append('clientDTO', JSON.stringify(client));
  
    return this.http.post<any>(`${environment.apiUrl}/api/Clients`, formData);
  }
  
  updateClient(id:number, clientDTO: any, file: File): Observable<void> {
    const formData: FormData = new FormData();
    
    if (file)
      formData.append('file', file, file.name);
    
    formData.append('clientDTO', JSON.stringify(clientDTO));
  
    return this.http.post<void>(`${environment.apiUrl}/api/Clients/${id}`, formData);
  }

  deleteClient(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/api/Clients/${id}`);
  }
}
