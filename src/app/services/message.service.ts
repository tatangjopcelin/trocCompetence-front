import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Message {
  id: number;
  exchange_id: number;
  user_id: number;
  content: string | null;
  file_path: string | null;
  created_at: string;
  
}

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/messages`, this.getAuthHeaders());
  }

  sendMessage(exchangeId: number, content: string, file?: File): Observable<Message> {
    const formData = new FormData();
    formData.append('exchange_id', exchangeId.toString());
    formData.append('content', content);

    if (file) {
      formData.append('file', file);
    }

    return this.http.post<Message>(`${this.apiUrl}/messages`, formData, this.getAuthHeaders());
  }

  deleteMessage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/messages/${id}`, this.getAuthHeaders());
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`, this.getAuthHeaders());
  }

  
  
}
