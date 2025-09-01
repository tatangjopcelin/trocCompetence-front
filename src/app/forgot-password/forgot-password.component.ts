import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="form-box">
        <h2>Mot de passe oublié/Modification</h2>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <input formControlName="email" placeholder="Adresse email" type="email" class="input" />
          <button type="submit" [disabled]="form.invalid" class="btn">Envoyer le lien</button>
        </form>
        <p *ngIf="error" class="error">{{ error }}</p>
        <a routerLink="/login" class="back-link">← Retour à la connexion</a>
      </div>
    </div>
  `,
  styles: [`
    .container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f3f4f6;
      padding: 20px;
    }

    .form-box {
      background-color:rgb(189, 173, 173);
      padding: 30px 40px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
      text-align: center;
    }

    h2 {
      margin-bottom: 20px;
      color: #111827;
    }

    .input {
      width: 93%;
      padding: 12px;
      margin-bottom: 15px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 16px;
      outline: none;
      transition: border-color 0.2s;
      
    }

    .input:focus {
      border-color: #3b82f6;
    }

    .btn {
      width: 100%;
      padding: 12px;
      background: #3b82f6;
      color: white;
      font-weight: bold;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn:hover {
      background: #2563eb;
    }

    .error {
      color: #dc2626;
      margin-top: 10px;
    }

    .back-link {
      display: block;
      margin-top: 15px;
      color: #3b82f6;
      text-decoration: none;
    }

    .back-link:hover {
      text-decoration: underline;
    }
  `]
})
export class ForgotPasswordComponent {
  form: FormGroup;
  error = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    const email = this.form.value.email;

    this.http.post('http://localhost:8000/api/forgot-password', { email }).subscribe({
      next: (res: any) => {
        const { token, email } = res;
        this.router.navigate(['/reset-password'], { queryParams: { token, email } });
      },
      error: (err) => {
        this.error = err.error?.error || 'Erreur inattendue.';
      }
    });
  }
}
