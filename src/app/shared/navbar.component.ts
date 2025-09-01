import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule,
    FormsModule
  ],
  template: `
    <nav class="menu">
      <a class="logo" routerLink="/home">
        TrocCompétence
      </a>

      <form class="search-form" (submit)="onSearchSubmit()">
      <input type="text" [(ngModel)]="searchTerm" name="search" placeholder="Rechercher une compétence..." />
      <select [(ngModel)]="searchType" name="type">
        <option value="proposee">Proposée</option>
        <option value="recherchee">Recherchée</option>
      </select>
      <button type="submit">🔍</button>
    </form>

      <div class="nav-buttons">
        <ng-container *ngIf="!userIsLoggedIn; else loggedInTemplate">
          <button routerLink="/login" class="btn">Se connecter</button>
          <button routerLink="/register" class="btn btn-primary">Créer un compte</button>
        </ng-container>

        <ng-template #loggedInTemplate>
          <button routerLink="/dashboard" class="btn">Mon espace</button>
          <button (click)="logout()" class="btn btn-primary">Déconnexion</button>
        </ng-template>
      </div>
    </nav>
  `,
  styles: [`
    .menu {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 17px 20px;
      background-color: #004aad;
      color: white;
      border-radius: 6px;

    }

    .search-form {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  input[type="text"],
  select {
    padding: 0.6rem 1rem;
    border: 1px solid #ccc;
    border-radius: 0.75rem;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.3s;

    &:focus {
      border-color: #007bff;
    }
  }

  select {
    background-color: #fff;
    cursor: pointer;
  }

  button[type="submit"] {
    padding: 0.6rem 1.2rem;
    font-size: 1.2rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #0056b3;
    }
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;

    input,
    select,
    button {
      width: 100%;
    }
  }
}


    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      text-decoration: none;
      color: white;
      transition: text-decoration 0.3s ease;
    }

    .logo:hover {
      text-decoration: none;
    }

    .nav-buttons button {
      margin-left: 10px;
      padding: 8px 15px;
      font-weight: 600;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .btn {
      background-color: transparent;
      color: white;
      transition: background-color 0.3s ease;
    }

    .btn:hover {
      background-color: rgba(255,255,255,0.2);
    }

    .btn-primary {
      background-color: #f0a500;
      color: black;
    }

    .btn-primary:hover {
      background-color: #d18e00;
    }
  `]
})
export class NavbarComponent implements OnInit {
  userIsLoggedIn = false;
  searchTerm: string = '';
  searchType: string = 'proposee'; 
  
  onSearchSubmit(): void {
    if (!this.searchTerm.trim()) return;
  
    this.router.navigate(['/recherche'], {
      queryParams: {
        competence: this.searchTerm,
        type: this.searchType
      }
    });
    this.searchTerm = ''; 
    this.searchType = 'proposee'; 
  }
  

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.isLoggedIn.subscribe((status) => {
      this.userIsLoggedIn = status;
    });
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        this.auth.clearToken();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erreur lors de la déconnexion', err);
      }
    });
  }
}
