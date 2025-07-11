// src/app/footer/footer.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2025 TrocCompétence. Tous droits réservés.</p>
        <nav>
          <a routerLink="/home">TrocCompétence</a> |
          <a routerLink="/Allusers">Utilisateurs</a> |
          <a routerLink="/register">Créer un compte</a>
        </nav>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #004aad;
      color: white;
      padding: 20px 0;
      text-align: center;
      position: relative;
      bottom: 0;
      width: 100%;
      margin-top: 40px;
    }
    .footer a {
      color: white;
      text-decoration: none;
      margin: 0 5px;
    }
    .footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class FooterComponent {}
