import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseApi } from '@app/core/interfaces/response-api';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectAssignmentService {
  constructor(
    private http: HttpClient
  ) { }

  getProjectAssignments(): Observable<ResponseApi> {
    return this.http.get<any>(`${environment.apiUrl}/api/ProjectAssignments`);
  }

  getProjectAssignment(id: number): Observable<ResponseApi> {
    return this.http.get<any>(`${environment.apiUrl}/api/ProjectAssignments/${id}`);
  }

  addProjectAssignment(data: any, file: File): Observable<any> {
    const formData: FormData = new FormData();
    
    if (file)
      formData.append('file', file, file.name);
    
    formData.append('dto', JSON.stringify(data));
  
    return this.http.post<any>(`${environment.apiUrl}/api/ProjectAssignments`, formData);
  }
  
  updateProjectAssignment(id:number, data: any, file: File): Observable<void> {
    const formData: FormData = new FormData();
    if (file)
      formData.append('file', file, file.name);
    
    formData.append('dto', JSON.stringify(data));
  
    return this.http.put<void>(`${environment.apiUrl}/api/ProjectAssignments/${id}`, formData);
  }

  deleteProjectAssignment(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/api/ProjectAssignments/${id}`);
  }
}