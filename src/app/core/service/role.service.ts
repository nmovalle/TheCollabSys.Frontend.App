import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(
    private http: HttpClient
  ) { }

  getRoles(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/Roles/GetAllRolesAsync`);
  }

  getProposalRoles(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/ProposalRoles/GetAllProposalRolesAsync`);
  }

  
}
