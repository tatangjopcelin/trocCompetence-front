import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <h1>Bienvenue sur ton espace, {{ user?.name }} !</h1>

      <div class="card-grid">
        <div class="card">
          <h2> Mon profil</h2>
          <button routerLink="/profil"> Modifier mon profil</button>
        </div>

        <div class="card">
          <h2>Mes échanges</h2>
          <button routerLink="/mes-echanges">Voir mes échanges</button>
        </div>

        <div class="card">
          <h2>Mes compétences</h2>
          <div class="button-group">
          <button routerLink="/mes-competences">Voir / Gérer mes compétences</button>
          <button routerLink="/ajouter-competence">Ajouter une compétence</button>
          </div>
        </div>

        <div class="card">
          <h2>Mon CV</h2>
          <button routerLink="/cv">Gérer mes CV</button>
        </div>

        <div class="card">
          <h2>Mes badges</h2>
          <button routerLink="/badges">Voir mes badges</button>
        </div>

        <div class="card">
          <h2>Mes groupes</h2>
          <button routerLink="/groupes">Accéder à mes groupes</button>
        </div>
        <div class="card">
          <h2>Mes Disponibilites</h2>
          <button routerLink="/disponibilites">Voir mes Disponibilites</button>
      </div>
    </div>
  `,
  styles: [`

    .button-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
    }

    @media (min-width: 500px) {
      .button-group {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: start;
      }
    }

    .button-group button {
      flex: 1;
    }

    .dashboard {
      padding: 30px;
      max-width: 1200px;
      margin: auto;
      background-color: rgb(150, 88, 88);
      border-radius: 12px;  
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    h1 {
      margin-bottom: 40px;
      font-size: 2rem;
      text-align: center;
    }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;
    }

    @media (max-width: 1024px) {
      .card-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .card-grid {
        grid-template-columns: 1fr;
      }
    }

    .card {
      // background: #fff;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      align-items: start;
      transition: transform 0.2s ease;
      background-color: rgb(248, 203, 4);
    }

    .card:hover {
      transform: translateY(-5px);
    }

    .card h2 {
      margin-bottom: 15px;
      font-size: 1.3rem;
      color: #004aad;
    }

    .card button {
      padding: 10px 20px;
      background-color: #004aad;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
    }

    .card button:hover {
      background-color: #00307a;
    }
  `]
})
export class DashboardComponent {
  private authService = inject(AuthService);
  user: any = null;

  ngOnInit() {
    this.authService.me().subscribe({
      next: (data) => this.user = data,
      error: (err) => console.error('Erreur utilisateur', err)
    });
  }
}
