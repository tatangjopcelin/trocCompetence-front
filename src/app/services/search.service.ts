import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  searchCompetence(competence: string, type: string = 'proposee'): Observable<any> {
    return this.http.get(`${this.baseUrl}/search`, {
      params: { competence, type },
      
    });
  }
}
