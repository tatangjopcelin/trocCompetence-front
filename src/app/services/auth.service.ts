import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  // État de connexion : true/false
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: { email: string; password: string }): Observable<any> {
    return new Observable(observer => {
      this.http.post<any>(`${this.apiUrl}/login`, data).subscribe({
        next: res => {
          localStorage.setItem('token', res.access_token);
          this.isLoggedInSubject.next(true);
          observer.next(res);
          observer.complete();
        },
        error: err => {
          observer.error(err);
        }
      });
    });
  }

  logout(): Observable<any> {
    return new Observable(observer => {
      this.http.post(`${this.apiUrl}/logout`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }).subscribe({
        next: res => {
          this.clearToken();
          this.isLoggedInSubject.next(false);
          observer.next(res);
          observer.complete();
        },
        error: err => {
          observer.error(err);
        }
      });
    });
  }

  clearToken(): void {
    localStorage.removeItem('token');
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // ✅ Nouvelle méthode : récupérer les infos de l'utilisateur connecté
  me(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
}
