import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserRole } from '../constants/types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  googleAuthInProgress: boolean = false;

  constructor(
    private http: HttpClient
  ) { }

  public isLoggedIn(): boolean {
    return localStorage.getItem('accessToken') !== null;
  }

  public setAuthProvider(authProvider: string) {
    localStorage.setItem('authProvider', authProvider);
  }

  public getAuthProvider() {
    return localStorage.getItem('authProvider');
  }

  public setUsername(username: string) {
    localStorage.setItem('username', username);
  }

  public getUsername() {
    return localStorage.getItem('username');
  }

  public setAccessToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  public getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  public setRefreshToken(refreshToken: string) {
    localStorage.setItem('refreshToken', refreshToken);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  public setAccessTokenExpiration(accessTokenExpiration: string) {
    localStorage.setItem('accessTokenExpiration', accessTokenExpiration);
  }
  
  public getAccessTokenExpiration(): string | null {
    return localStorage.getItem('accessTokenExpiration');
  }

  public setUserRole(userRole: UserRole) {
    localStorage.setItem('userRole', JSON.stringify(userRole));
  }
  
  public getUserRole(): UserRole | null {
    const userRole = localStorage.getItem('userRole');
    if (userRole) {
      return JSON.parse(userRole);
    }

    return null;
  }

  public cleanLocalStorage() {
    localStorage.clear();
  }

  public logout() {
    this.cleanLocalStorage();
  }

  public validateOAuthDomain(user: any): Observable<any> {
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

  setGoogleAuthInProgress(inProgress: boolean) {
    this.googleAuthInProgress = inProgress;
  }

  isGoogleAuthInProgress() {
    return this.googleAuthInProgress;
  }

}
