import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Competence {
  id: number;
  name: string;
  pivot: {
    user_id: number;
    competence_id: number;
    type: string;
  };
}

export interface Availability {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
}

export interface UserWithCompetences {
  id: number;
  name: string;
  proposees: Competence[];
  recherchees: Competence[];
  role: string;
  availabilities?: Availability[];
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token || ''}`
      })
    };
  }

  getUsersWithCompetences(): Observable<UserWithCompetences[]> {
    // Cette route est peut-être publique, pas besoin du token ici ? À adapter selon ton API
    return this.http.get<UserWithCompetences[]>(`${this.apiUrl}/Allusers/competences`);
  }

  getProfile(): Observable<UserProfile> {
    // Ici le token est nécessaire pour accéder au profil connecté
    return this.http.get<UserProfile>(`${this.apiUrl}/me`, this.getAuthHeaders());
  }

  // 🔹 Mettre à jour le profil utilisateur (nom/email)
  updateProfile(data: Partial<UserProfile>): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-profile`, data, this.getAuthHeaders());
  }

  // 🔹 Ajouter cette méthode à UserService
deleteUser(userId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/users/${userId}`, this.getAuthHeaders());
}

}
