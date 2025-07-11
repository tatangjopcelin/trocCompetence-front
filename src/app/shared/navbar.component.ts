import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <nav class="menu">
      <a class="logo" routerLink="/home">
        TrocCompétence
      </a>
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
