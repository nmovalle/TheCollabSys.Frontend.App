import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserCompany, UserRole } from '../constants/types';
import { MenuRoleDetailDTO } from '../interfaces/menu';

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

  public setUserCompany(userCompany: UserCompany) {
    localStorage.setItem('userCompany', JSON.stringify(userCompany));
  }
  
  public getUserCompany(): UserCompany | null {
    const userCompany = localStorage.getItem('userCompany');
    if (userCompany) {
      return JSON.parse(userCompany);
    }

    return null;
  }

  public setUsermenu(usermenu: MenuRoleDetailDTO[]) {
    localStorage.setItem('usermenu', JSON.stringify(usermenu));
  }
  
  public getUsermenu(): MenuRoleDetailDTO[] | null {
    const usermenu = localStorage.getItem('usermenu');
    if (usermenu) {
      return JSON.parse(usermenu);
    }

    return null;
  }

  public setChangePasswordConfirmed(isFirstTime: boolean) {
    localStorage.setItem('passwordConfirmed', isFirstTime.toString());
  }

  public getChangePasswordConfirmed(): boolean {
    const value = localStorage.getItem('passwordConfirmed');
    return value === 'true';
  }

  public cleanLocalStorage() {
    localStorage.clear();
  }

  public logout() {
    this.cleanLocalStorage();
  }

  public validateOAuthDomain(user: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/auth/validate-oauth-domain`, user).pipe(
      catchError(error => {
        console.error('Error en validateOAuthDomain:', error);
        const errorResponse = error.error || { message: 'Unknown error', email: null };
        return of({
          error: true,
          status: error.status,
          message: errorResponse.message,
          type: errorResponse.type,
          AccessCodeGenerated: errorResponse.AccessCodeGenerated || false,
          email: errorResponse.email || null,
          userId: errorResponse.userId || null,
          domain: user.hd
        } as AuthError);
      })
    );
  }
  
  public login(username: string): Observable<any> {
    // return this.http.post<any>(`${environment.apiUrl}/api/auth/login`, username);
    return this.http.post<any>(`${environment.apiUrl}/api/auth/login`, username).pipe(
      catchError(error => {
        console.error('Error en validateOAuthDomain:', error);
        const errorResponse = error.error || { message: 'Unknown error', email: null };
        return of({
          error: true,
          status: error.status,
          message: errorResponse.message,
        } as AuthError);
      })
    );
  }

  public authDomain(userid: string): Observable<any> {
    const body = { userId: userid };
    return this.http.post<any>(`${environment.apiUrl}/api/Token/token-domain`, body).pipe(
      catchError(error => {
        console.error('Error en validateOAuthDomain:', error);
        const errorResponse = error.error || { message: 'Unknown error', email: null };
        return of({
          error: true,
          status: error.status,
          message: errorResponse.message,
        } as AuthError);
      })
    );
  }

  public getUserMenu(username: string): Observable<MenuRoleDetailDTO[] | MenuError> {
    return this.http.get<MenuRoleDetailDTO[]>(`${environment.apiUrl}/api/auth/menus/${username}`).pipe(
      catchError(error => {
        console.error('Error en getUserMenu:', error);
        return of({ error: true, status: error.status, message: error.message } as MenuError);
      })
    );
  }

  public getUserData(username: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/auth/GetUserByName/${username}`);
  }

  public resendAccessCode(email: string): Observable<any> {
    const body = { email };
    return this.http.post<any>(`${environment.apiUrl}/api/AccessCode/resend`, body);
  }

  public validateAccessCode(email: string, code: string): Observable<ValidateAccessCode> {
    const body = { email, code };
  
    return this.http.post<ValidateAccessCode>(`${environment.apiUrl}/api/AccessCode/validate`, body).pipe(
      catchError(error => {
        console.error('Error en validateAccessCode:', error);
  
        const errorResponse = error.error || { message: 'Unknown error', email: null, accessCode: null };
        return of({
          error: true,
          status: error.status,
          message: errorResponse.message,
          accessCode: errorResponse.accessCode,
          email: errorResponse.email || null
        });
      })
    );
  }

  public refreshToken(refreshToken: string): Observable<any> {
    const body = { refreshToken };
    return this.http.post<any>(`${environment.apiUrl}/api/Token/refreshtoken`, body)
      .pipe(
        tap(response => {
          this.setAccessToken(response.accessToken);
          this.setRefreshToken(response.refreshToken);
        })
      );
  }

  setGoogleAuthInProgress(inProgress: boolean) {
    this.googleAuthInProgress = inProgress;
  }

  isGoogleAuthInProgress() {
    return this.googleAuthInProgress;
  }

  public getPermissions(routerLink: string) {
    const menuItems = this.getUsermenu()
    const menuItem = menuItems.find(menu => {
      const foundItem = menu.items.find(item => item.routerLink === routerLink);
      return foundItem !== undefined;
    });

    return menuItem ? menuItem.items.find(item => item.routerLink === routerLink) : null;
  }

  public findMenuItemWithPermission = (url: string, menu: MenuRoleDetailDTO) => {
    const urlSegments = url.split('/').filter(Boolean);
  
    for (const item of menu.items) {
      const itemSegments = item.routerLink.split('/').filter(Boolean);
  
      const isBaseMatch = itemSegments.every((segment, index) => urlSegments[index] === segment);
      
      if (isBaseMatch) {
        const subRoute = urlSegments[itemSegments.length];
        if (
          (subRoute === 'read' && item.view) ||
          (subRoute === 'edit' && item.edit) ||
          (subRoute === 'add' && item.add) ||
          (!subRoute && urlSegments.length === itemSegments.length)
        ) {
          return item;
        }
      }
    }
    return null;
  };
}


export interface AuthError {
  error: boolean;
  status: number;
  message: string;
  type: string;
  userId: string;
  AccessCodeGenerated?: boolean;
  email: string;
  domain: string;
}

export interface MenuError {
  error: boolean;
  status: number;
  message: string;
}

export interface ValidateAccessCode {
  error: boolean;
  status: number;
  message: string;
  accessCode?: string;
  email?: string;
}