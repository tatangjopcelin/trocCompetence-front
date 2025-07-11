import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-competence',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <h2>Ajouter une compétence</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <input formControlName="name" placeholder="Nom de la compétence" class="input" />
        <button type="submit" [disabled]="form.invalid" class="btn">Créer</button>
      </form>
      <p *ngIf="success" class="success">{{ success }}</p>
      <p *ngIf="error" class="error">{{ error }}</p>
    </div>
  `,
  styles: [`
    .container {
      max-width: 400px;
      margin: 40px auto;
      padding: 30px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.1);
      text-align: center;
      background-color: rgb(248, 203, 4);
    }
    .input {
      width: 100%;
      padding: 12px;
      margin-bottom: 15px;
      border: 1px solid #ccc;
      border-radius: 8px;
      font-size: 16px;
    }
    .btn {
      width: 100%;
      padding: 12px;
      background-color: #3b82f6;
      border: none;
      color: white;
      font-weight: bold;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .btn:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
    }
    .btn:hover:not(:disabled) {
      background-color: #2563eb;
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
export class AddCompetenceComponent {
  form: FormGroup;
  success = '';
  error = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      name: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.success = '';
    this.error = '';

    const name = this.form.value.name;
    const token = localStorage.getItem('token');

    if (!token) {
      this.error = 'Vous devez être connecté pour ajouter une compétence.';
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.post('http://localhost:8000/api/competences', { name }, { headers }).subscribe({
      next: (res: any) => {
        this.success = `Compétence "${res.name}" créée avec succès !`;
        this.form.reset();
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors de la création.';
      }
    });
  }
}
