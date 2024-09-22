import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseApi } from '@app/core/interfaces/response-api';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(
    private http: HttpClient
  ) { }

  getProjects(): Observable<ResponseApi> {
    return this.http.get<any>(`${environment.apiUrl}/api/Projects`);
  }

  getProjectsDetail(): Observable<ResponseApi> {
    return this.http.get<any>(`${environment.apiUrl}/api/Projects/GetDetail`);
  }

  getProject(id: number): Observable<ResponseApi> {
    return this.http.get<any>(`${environment.apiUrl}/api/Projects/${id}`);
  }

  getProjectKPIs(): Observable<ResponseApi> {
    return this.http.get<any>(`${environment.apiUrl}/api/Projects/kpis`);
  }

  addProject(data: any, file: File): Observable<any> {
    const formData: FormData = new FormData();
    
    if (file)
      formData.append('file', file, file.name);
    
    formData.append('dto', JSON.stringify(data));
  
    return this.http.post<any>(`${environment.apiUrl}/api/Projects`, formData);
  }
  
  updateProject(id:number, data: any, file: File): Observable<void> {
    const formData: FormData = new FormData();
    if (file)
      formData.append('file', file, file.name);
    
    formData.append('dto', JSON.stringify(data));
  
    return this.http.put<void>(`${environment.apiUrl}/api/Projects/${id}`, formData);
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/api/Projects/${id}`);
  }
}
