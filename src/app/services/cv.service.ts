import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cv {
  id?: number;
  user_id?: number;
  titre: string;
  profil?: string;
  langues?: string;
  permis_conduire?: string;
  experiences?: { poste: string; entreprise: string; debut: string; fin?: string; description?: string }[];
  formations?: { diplome: string; etablissement: string; annee: string }[];
  skills?: { name: string; niveau?: string }[];
  centresInteret?: { name: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class CvService {
  private apiUrl = 'http://localhost:8000/api/cvs';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getMyCvs(): Observable<Cv[]> {
    return this.http.get<Cv[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getCv(id: number): Observable<Cv> {
    return this.http.get<Cv>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createCv(cv: Cv): Observable<Cv> {
    return this.http.post<Cv>(this.apiUrl, cv, { headers: this.getAuthHeaders() });
  }

  updateCv(id: number, cv: Cv): Observable<Cv> {
    return this.http.put<Cv>(`${this.apiUrl}/${id}`, cv, { headers: this.getAuthHeaders() });
  }

  deleteCv(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
