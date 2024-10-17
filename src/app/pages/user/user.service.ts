import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseApi } from '@app/core/interfaces/response-api';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<ResponseApi> {
    return this.http.get<any>(`${environment.apiUrl}/api/User`);
  }

  getUser(id: string): Observable<ResponseApi> {
    return this.http.get<any>(`${environment.apiUrl}/api/User/${id}`);
  }
}
