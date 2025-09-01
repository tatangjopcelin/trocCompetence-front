import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Availability {
  id: number;
  user_name?: string; // optionnel, car backend l’envoie
  date: string;
  start_time: string;
  end_time: string;
}

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  private apiUrl = 'http://localhost:8000/api/availabilities';

  constructor(private http: HttpClient) {}

  // Méthode pour générer les headers avec token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Récupérer toutes les disponibilités
  getAvailabilities(): Observable<Availability[]> {
    return this.http.get<Availability[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // Créer une dispo
  createAvailability(data: Omit<Availability, 'id' | 'user_name'>): Observable<Availability> {
    return this.http.post<Availability>(this.apiUrl, data, { headers: this.getAuthHeaders() });
  }

  // Modifier une dispo
  updateAvailability(id: number, data: Omit<Availability, 'id' | 'user_name'>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, { headers: this.getAuthHeaders() });
  }

  // Supprimer une dispo
  deleteAvailability(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

 // Attacher une compétence à une disponibilité
attachCompetenceToAvailability(availabilityId: number, competenceId: number): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/${availabilityId}/competences`,
    { competence_id: competenceId },
    { headers: this.getAuthHeaders() }
  );
}

}
