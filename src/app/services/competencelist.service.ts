import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Competence {
  id: number;
  name: string;
  user_id: number;
  creator: {
    id: number;
    name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CompetencelistService {
  private apiUrl = 'http://localhost:8000/api/competences';
  private meUrl = 'http://localhost:8000/api/me';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  // ✅ 1. Lister les compétences
  getCompetences(): Observable<Competence[]> {
    return this.http.get<Competence[]>(this.apiUrl, this.getAuthHeaders());
  }

  // ✅ 2. Mettre à jour une compétence
  updateCompetence(id: number, name: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { name }, this.getAuthHeaders());
  }

  // ✅ 3. Supprimer une compétence
  deleteCompetence(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  // ✅ 4. Décoder le token
  decodeToken(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.user?.id || null;
    } catch {
      return null;
    }
  }

  // ✅ 5. Récupérer l'utilisateur connecté depuis l'API
  getCurrentUser(): Observable<any> {
    return this.http.get(this.meUrl, this.getAuthHeaders());
  }
}
