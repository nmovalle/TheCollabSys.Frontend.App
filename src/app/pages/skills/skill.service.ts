import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseApi } from '@app/core/interfaces/response-api';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkillService {

  constructor(
    private http: HttpClient
  ) { }

  getSkills(): Observable<ResponseApi> {
    return this.http.get<any>(`${environment.apiUrl}/api/Skills`);
  }

  getSkill(id: number): Observable<ResponseApi> {
    return this.http.get<any>(`${environment.apiUrl}/api/Skills/${id}`);
  }

  addSkill(data: any, file: File): Observable<any> {
    const formData: FormData = new FormData();
    
    if (file)
      formData.append('file', file, file.name);
    
    formData.append('dto', JSON.stringify(data));
  
    return this.http.post<any>(`${environment.apiUrl}/api/Skills`, formData);
  }
  
  updateSkill(id:number, data: any, file: File): Observable<void> {
    const formData: FormData = new FormData();
    
    if (file)
      formData.append('file', file, file.name);
    
    formData.append('dto', JSON.stringify(data));
  
    return this.http.post<void>(`${environment.apiUrl}/api/Skills/${id}`, formData);
  }

  deleteSkill(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/api/Skills/${id}`);
  }
}
