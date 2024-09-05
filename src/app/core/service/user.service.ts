import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  getUserByUserName(username: string) {
    return this.http.get<any>(`${environment.apiUrl}/api/User/GetUserByName/${username}`);
  }

  register(user: any) {
    return this.http.post(`${environment.apiUrl}/api/User/register`, user);
  }

  simpleRegister(user: any) {
    return this.http.post(`${environment.apiUrl}/api/User/simple-register`, user);
  }

  login(credentials: any) {
    return this.http.post(`${environment.apiUrl}/api/User/login`, credentials);
  }

  updatePassword(updatePassword: any) {
    return this.http.post(`${environment.apiUrl}/api/User/updatepassword`, updatePassword);
  }

  updateUserRole(username: string, newRoleId: string) {
    return this.http.post(`${environment.apiUrl}/api/UserRole/UpdateUserRoleByUserName/${username}/${newRoleId}`, null);
  }
}
