import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompetenceService {
  private baseUrl = 'http://localhost:8000/api/user/competences'; // pour l'utilisateur
  private allCompetencesUrl = 'http://localhost:8000/api/competences';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getUserCompetences(): Observable<any> {
    return this.http.get(this.baseUrl, {
      headers: this.getAuthHeaders()
    });
  }

  addCompetence(competenceId: number, type: 'proposee' | 'recherchee'): Observable<any> {
    return this.http.post(this.baseUrl, { competence_id: competenceId, type }, {
      headers: this.getAuthHeaders()
    });
  }

  updateCompetenceType(competenceId: number, type: 'proposee' | 'recherchee'): Observable<any> {
    return this.http.put(this.baseUrl, { competence_id: competenceId, type }, {
      headers: this.getAuthHeaders()
    });
  }

  deleteCompetence(competenceId: number): Observable<any> {
    return this.http.request('delete', this.baseUrl, { 
      body: { competence_id: competenceId },
      headers: this.getAuthHeaders()
    });
  }

  getAllCompetences(): Observable<any[]> {
    return this.http.get<any[]>(this.allCompetencesUrl, {
      headers: this.getAuthHeaders()
    });
  }
}
