import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseApi } from '@app/core/interfaces/response-api';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {
  constructor(private http: HttpClient) { }

  getUserRoles(): Observable<ResponseApi> {
    return this.http.get<any>(`${environment.apiUrl}/api/UserRole`);
  }

  getUserRole(id: string): Observable<ResponseApi> {
    return this.http.get<any>(`${environment.apiUrl}/api/UserRole/${id}`);
  }

  add(data: any, file: File): Observable<any> {
    const formData: FormData = new FormData();
    
    if (file)
      formData.append('file', file, file.name);
    
    formData.append('dto', JSON.stringify(data));
  
    return this.http.post<any>(`${environment.apiUrl}/api/UserRole`, formData);
  }
  
  update(id:string, data: any, file: File): Observable<void> {
    const formData: FormData = new FormData();
    
    if (file)
      formData.append('file', file, file.name);
    
    formData.append('dto', JSON.stringify(data));
  
    return this.http.put<void>(`${environment.apiUrl}/api/UserRole/${id}`, formData);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/api/UserRole/${id}`);
  }
}
