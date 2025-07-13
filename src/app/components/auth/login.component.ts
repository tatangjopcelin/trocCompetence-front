import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-container">
      <h2>Connexion</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <input formControlName="email" placeholder="Adresse email" type="email" />
        <input formControlName="password" placeholder="Mot de passe" type="password" />
        <button type="submit" [disabled]="form.invalid">Se connecter</button>
      </form>

      <p class="forgot-link">
      <a routerLink="/forgot-password">Mot de passe oublié ?</a>
      </p>

      <p *ngIf="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 40px auto;
      padding: 30px;
      background-color:rgb(189, 173, 173);
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    h2 {
      text-align: center;
      margin-bottom: 20px;
      color: #004aad;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    input {
      padding: 10px 12px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.3s ease;
    }

    input:focus {
      border-color: #004aad;
      outline: none;
    }

    button {
      padding: 10px 15px;
      background-color: #004aad;
      color: white;
      font-weight: bold;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    button:disabled {
      background-color: #888;
      cursor: not-allowed;
    }

    button:hover:not(:disabled) {
      background-color: #003a91;
    }

    .forgot-link {
      text-align: center;
      margin-top: 10px;
    }

    .forgot-link a {
      color: #004aad;
      text-decoration: underline;
      font-size: 14px;
      cursor: pointer;
    }

    .error {
      margin-top: 15px;
      text-align: center;
      color: red;
      font-weight: bold;
    }
  `]
})
export class LoginComponent {
  form;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const credentials = {
        email: this.form.get('email')!.value || '',
        password: this.form.get('password')!.value || ''
      };
      this.auth.login(credentials).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.access_token);
          this.router.navigate(['/dashboard']); // Rediriger vers la page d'accueil
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Email ou mot de passe incorrect';
        }
      });
    }
  }
}
