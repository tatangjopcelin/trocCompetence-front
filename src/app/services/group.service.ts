import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Group {
  id: number;
  name: string;
  user_id: number;
  //users: any[];
  users: { id: number; name: string; email: string }[];
}

export interface GroupMessage {
  id: number;
  group_id: number;
  user_id: number;
  message: string | null;
  attachment: string | null;
  created_at: string;
  user: {
    id: number;
    name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private baseUrl = 'http://localhost:8000/api/groups';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token || ''}`
      })
    };
  }

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.baseUrl, this.getAuthHeaders());
  }

  getGroup(groupId: number): Observable<Group> {
    return this.http.get<Group>(`${this.baseUrl}/${groupId}`, this.getAuthHeaders());
  }

  createGroup(name: string): Observable<Group> {
    return this.http.post<Group>(this.baseUrl, { name }, this.getAuthHeaders());
  }

  inviteUserToGroup(groupId: number, userId: number): Observable<any> {
    return this.http.post(`http://localhost:8000/api/groups/${groupId}/invite`, {
      user_id: userId
    } , this.getAuthHeaders());
  }
  

  removeUser(groupId: number, userId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/remove/${groupId}`, { user_id: userId }, this.getAuthHeaders());
  }

  getMessages(groupId: number): Observable<GroupMessage[]> {
    return this.http.get<GroupMessage[]>(`${this.baseUrl}/messages/${groupId}`, this.getAuthHeaders());
  }

  sendMessage(groupId: number, message: string, file?: File): Observable<GroupMessage> {
    const formData = new FormData();
    if (message) formData.append('message', message);
    if (file) formData.append('attachment', file);

    return this.http.post<GroupMessage>(`${this.baseUrl}/messages/${groupId}`, formData, this.getAuthHeaders());
  }

  getUserGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`http://localhost:8000/api/groups`, this.getAuthHeaders());
  }
  

}
