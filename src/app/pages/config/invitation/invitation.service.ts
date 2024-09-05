import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseApi } from '@app/core/interfaces/response-api';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  constructor(
    private http: HttpClient
  ) { }

  getInvitations(): Observable<ResponseApi> {
    return this.http.get<any>(`${environment.apiUrl}/api/Invitation`);
  }

  getInvitation(id: number): Observable<ResponseApi> {
    return this.http.get<any>(`${environment.apiUrl}/api/Invitation/${id}`);
  }

  addInvitation(data: any, file: File): Observable<any> {
    const formData: FormData = new FormData();
    
    if (file)
      formData.append('file', file, file.name);
    
    formData.append('dto', JSON.stringify(data));
  
    return this.http.post<any>(`${environment.apiUrl}/api/Invitation`, formData);
  }
  
  updateInvitation(id:number, data: any, file: File): Observable<void> {
    const formData: FormData = new FormData();
    
    if (file)
      formData.append('file', file, file.name);
    
    formData.append('dto', JSON.stringify(data));
  
    return this.http.put<void>(`${environment.apiUrl}/api/Invitation/${id}`, formData);
  }

  deleteInvitation(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/api/Invitation/${id}`);
  }

  generate(request: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/Invitation/generate`, request);
  }

  validate(token: string): Observable<ResponseApi> {
    return this.http.get<any>(`${environment.apiUrl}/api/Invitation/validate?token=${token}`);
  }
}
