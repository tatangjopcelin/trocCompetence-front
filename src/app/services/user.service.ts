// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

export interface UserWithCompetences {
  name: string;
  proposees: Competence[];
  recherchees: Competence[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api/Allusers/competences'; // adapter selon ton backend

  constructor(private http: HttpClient) {}

  getUsersWithCompetences(): Observable<UserWithCompetences[]> {
    return this.http.get<UserWithCompetences[]>(this.apiUrl);
  }
}
