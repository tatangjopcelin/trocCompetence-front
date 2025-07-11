import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
// import { MenuComponent } from './menu/menu.component'; // si tu veux aussi le menu
import { NavbarComponent } from './shared/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, NavbarComponent],
  template: `
  <app-navbar></app-navbar>
    <main class="page-content">
    <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    .page-content {
      min-height: calc(100vh - 160px); /* Ajuste selon la taille du header et footer */
      padding: 20px;
    }
  `]
})
export class AppComponent {}
