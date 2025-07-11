import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="form-box">
        <h2>Réinitialiser le mot de passe</h2>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <input formControlName="password" type="password" placeholder="Nouveau mot de passe" class="input" />
          <input formControlName="password_confirmation" type="password" placeholder="Confirmer le mot de passe" class="input" />
          <button type="submit" [disabled]="form.invalid" class="btn">Réinitialiser</button>
        </form>

        <p *ngIf="message" class="success">{{ message }}</p>
        <p *ngIf="error" class="error">{{ error }}</p>
      </div>
    </div>
  `,
  styles: [`
    .container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color:rgb(189, 173, 173);
      padding: 20px;
    }

    .form-box {
      background: #ffffff;
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
      width: 100%;
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

    .success {
      color: #16a34a;
      margin-top: 15px;
    }

    .error {
      color: #dc2626;
      margin-top: 15px;
    }
  `]
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  token = '';
  email = '';
  message = '';
  error = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      this.email = params['email'] || '';
    });
  }

  onSubmit() {
    const data = {
      token: this.token,
      email: this.email,
      password: this.form.value.password,
      password_confirmation: this.form.value.password_confirmation,
    };

    this.http.post('http://localhost:8000/api/reset-password', data).subscribe({
      next: (res: any) => {
        this.message = res.message;
        this.error = '';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.error = err.error?.error || 'Erreur lors de la réinitialisation.';
        this.message = '';
      }
    });
  }
}
