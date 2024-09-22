import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor(
    private http: HttpClient
  ) { }

  getStatuses(): Observable<ResponseApi> {
    return this.http.get<any>(`${environment.apiUrl}/api/Status`);
  }

  getByType(type: string): Observable<ResponseApi> {
    return this.http.get<any>(`${environment.apiUrl}/api/Status/GetByType/${type}`);
  }

  getStatus(id: number): Observable<ResponseApi> {
    return this.http.get<any>(`${environment.apiUrl}/api/Status/${id}`);
  }

  addStatus(data: any, file: File): Observable<any> {
    const formData: FormData = new FormData();
    
    if (file)
      formData.append('file', file, file.name);
    
    formData.append('dto', JSON.stringify(data));
  
    return this.http.post<any>(`${environment.apiUrl}/api/Status`, formData);
  }
  
  updateStatus(id:number, data: any, file: File): Observable<void> {
    const formData: FormData = new FormData();
    
    if (file)
      formData.append('file', file, file.name);
    
    formData.append('dto', JSON.stringify(data));
  
    return this.http.put<void>(`${environment.apiUrl}/api/Status/${id}`, formData);
  }

  deleteStatus(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/api/Status/${id}`);
  }
}
