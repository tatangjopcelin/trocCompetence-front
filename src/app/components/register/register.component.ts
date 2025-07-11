import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="register-container">
      <h2>Créer un compte</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <input formControlName="name" placeholder="Nom complet" />
        <input formControlName="email" placeholder="Adresse email" type="email" />
        <input formControlName="password" placeholder="Mot de passe" type="password" />
        <input formControlName="password_confirmation" placeholder="Confirmer le mot de passe" type="password" />
        <button type="submit" [disabled]="form.invalid">S'inscrire</button>
      </form>
      <p *ngIf="message" class="message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .register-container {
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

    .message {
      margin-top: 15px;
      text-align: center;
      color: green;
      font-weight: bold;
    }
  `]
})
export class RegisterComponent {
  message = '';

  form;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.auth.register(this.form.getRawValue() as {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
      }).subscribe({
        next: () => {
          this.message = 'Compte créé avec succès';
          this.form.reset();
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.message = err.error?.message || 'Erreur lors de l’inscription';
        },
      });
    }
  }
}
