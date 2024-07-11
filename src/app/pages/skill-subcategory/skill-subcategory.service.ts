import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseApi } from '@app/core/interfaces/response-api';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkillSubcategoryService {
  constructor(
    private http: HttpClient
  ) { }

  getSkillSubcategories(): Observable<ResponseApi> {
    return this.http.get<any>(`${environment.apiUrl}/api/SkillSubcategories`);
  }

  getSkillSubcategory(id: number): Observable<ResponseApi> {
    return this.http.get<any>(`${environment.apiUrl}/api/SkillSubcategories/${id}`);
  }

  addSkillSubcategory(data: any, file: File): Observable<any> {
    const formData: FormData = new FormData();
    
    if (file)
      formData.append('file', file, file.name);
    
    formData.append('dto', JSON.stringify(data));
  
    return this.http.post<any>(`${environment.apiUrl}/api/SkillSubcategories`, formData);
  }
  
  updateSkillSubcategory(id:number, data: any, file: File): Observable<void> {
    const formData: FormData = new FormData();
    if (file)
      formData.append('file', file, file.name);
    
    formData.append('dto', JSON.stringify(data));
  
    return this.http.put<void>(`${environment.apiUrl}/api/SkillSubcategories/${id}`, formData);
  }

  deleteSkillSubcategory(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/api/SkillSubcategories/${id}`);
  }
}
