import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoogleUserInfo } from '../interfaces/google-user-info';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
  ) { }


  public isLoggedIn(): boolean {
    return localStorage.getItem('accessToken') !== null;
  }

  public setAccessToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  public getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }



  public validateOAuthDomain(user: GoogleUserInfo): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/auth/validate-oauth-domain`, user);
  }

  public login(username: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/auth/login`, username);
  }

  public getUserMenu(username: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/auth/menus/${username}`);
  }

  public getUserData(username: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/auth/GetUserByName/${username}`);
  }

}
