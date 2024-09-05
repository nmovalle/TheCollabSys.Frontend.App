import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseApi } from '@app/core/interfaces/response-api';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterDomainService {

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<ResponseApi> {
    return this.http.get<any>(`${environment.apiUrl}/api/Domain`);
  }

  getById(id: number): Observable<ResponseApi> {
    return this.http.get<any>(`${environment.apiUrl}/api/Domain/${id}`);
  }

  getByDomain(domain: string): Observable<ResponseApi> {
    return this.http.get<any>(`${environment.apiUrl}/api/Domain/GetByDomain/${domain}`);
  }

  getCompanyByDomain(domain: string): Observable<ResponseApi> {
    return this.http.get<any>(`${environment.apiUrl}/api/Company/GetByDomain/${domain}`);
  }

  getUserCompanyByUserId(userid: string): Observable<ResponseApi> {
    return this.http.get<any>(`${environment.apiUrl}/api/UserCompany/GetByUserId/${userid}`);
  }

  createDomain(data: any, file: File): Observable<ResponseApi> {
    const formData: FormData = new FormData();
    
    if (file)
      formData.append('file', file, file.name);
    
    formData.append('dto', JSON.stringify(data));
  
    return this.http.post<any>(`${environment.apiUrl}/api/Domain`, formData);
  }

  createCompany(data: any, file: File): Observable<ResponseApi> {
    const formData: FormData = new FormData();
    
    if (file)
      formData.append('file', file, file.name);
    
    formData.append('dto', JSON.stringify(data));
  
    return this.http.post<any>(`${environment.apiUrl}/api/Company`, formData);
  }

  createUserCompany(data: any, file: File): Observable<ResponseApi> {
    const formData: FormData = new FormData();
    
    if (file)
      formData.append('file', file, file.name);
    
    formData.append('dto', JSON.stringify(data));
  
    return this.http.post<any>(`${environment.apiUrl}/api/UserCompany`, formData);
  }
}
