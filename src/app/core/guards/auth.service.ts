import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserRole } from '../constants/types';
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

  public getUserMenu(username: string): Observable<MenuRoleDetailDTO[]> {
    return this.http.get<MenuRoleDetailDTO[]>(`${environment.apiUrl}/api/auth/menus/${username}`);
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
