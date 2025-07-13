// src/app/services/user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Représente une compétence liée à un utilisateur (via la table pivot)
export interface Competence {
  id: number;
  name: string;
  pivot: {
    user_id: number;
    competence_id: number;
    type: string; // 'proposee' ou 'recherchee'
  };
}

// Représente un utilisateur avec ses compétences proposées et recherchées
export interface UserWithCompetences {
  id: number; // 👈 Identifiant de l'utilisateur (ajouté ici)
  name: string;
  proposees: Competence[];
  recherchees: Competence[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api/Allusers/competences'; // adapte selon ton backend

  constructor(private http: HttpClient) {}

  getUsersWithCompetences(): Observable<UserWithCompetences[]> {
    return this.http.get<UserWithCompetences[]>(this.apiUrl);
  }
}
