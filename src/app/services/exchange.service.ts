import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ExchangeService {
  private apiUrl = 'http://localhost:8000/api/exchanges';

  constructor(private http: HttpClient, private router: Router) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      throw new Error('Token manquant.');
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  createExchange(user2Id: number): Observable<any> {
    const headers = this.getAuthHeaders();

    return this.http.post(this.apiUrl, { user2_id: user2Id }, { headers }).pipe(
      catchError((err) => {
        if (err.status === 401) {
          console.warn('⛔ Token invalide ou expiré. Redirection vers login.');
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
        return throwError(() => err);
      })
    );
  }

  // 🔄 Récupérer tous les échanges de l'utilisateur connecté
  getMyExchanges(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(this.apiUrl, { headers }).pipe(
      catchError((err) => {
        console.error('Erreur lors du chargement des échanges :', err);
        return throwError(() => err);
      })
    );
  }

  // ✅ Mettre à jour le statut d’un échange (accepté, terminé)
  updateStatus(id: number, status: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put<any>(`${this.apiUrl}/${id}`, { status }, { headers }).pipe(
      catchError((err) => {
        console.error('Erreur lors de la mise à jour du statut :', err);
        return throwError(() => err);
      })
    );
  }

    // 📄 Récupérer un échange spécifique par ID
    getExchangeById(id: number): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.get<any>(`${this.apiUrl}/${id}`, { headers }).pipe(
        catchError((err) => {
            console.error('Erreur lors du chargement de l’échange :', err);
            return throwError(() => err);
        })
        );
    }
  
    // ❌ Supprimer un échange par son ID
    deleteExchange(id: number): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.delete(`${this.apiUrl}/${id}`, { headers }).pipe(
        catchError((err) => {
            console.error('Erreur lors de la suppression de l’échange :', err);
            return throwError(() => err);
        })
        );
    }
  
}
