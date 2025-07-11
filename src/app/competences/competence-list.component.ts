import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Competence {
  id: number;
  name: string;
}

@Component({
  selector: 'app-competence-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Liste des compétences</h2>

      <p *ngIf="success" class="success">{{ success }}</p>
      <p *ngIf="error" class="error">{{ error }}</p>

      <ul>
        <li *ngFor="let c of competences" class="competence-item">
          <input [(ngModel)]="c.name"
                 [readonly]="editingId !== c.id"
                 [class.invalid]="editingId === c.id && !c.name.trim()" />

          <ng-container *ngIf="editingId !== c.id">
            <button (click)="startEditing(c)" class="btn-update">Modifier</button>
          </ng-container>

          <ng-container *ngIf="editingId === c.id">
            <button (click)="updateCompetence(c)" class="btn-save">Enregistrer</button>
            <button (click)="cancelEditing(c)" class="btn-cancel">Annuler</button>
          </ng-container>

          <button (click)="deleteCompetence(c.id)" class="btn-delete">Supprimer</button>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .container {
      max-width: 600px;
      margin: 40px auto;
      padding: 30px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.1);
      background-color:rgb(189, 173, 173);
    }
    ul {
      padding: 0;
      list-style: none;
    }
    .competence-item {
      display: flex;
      gap: 10px;
      margin-bottom: 12px;
      align-items: center;
    }
    input {
      flex: 1;
      padding: 8px;
      font-size: 16px;
      border-radius: 6px;
      border: 1px solid #ccc;
    }
    input.invalid {
      border-color: #dc2626;
      background-color: #fee2e2;
    }
    .btn-update, .btn-delete {
      padding: 6px 12px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      color: white;
      transition: background-color 0.3s;
    }
    .btn-update {
      background-color: #3b82f6;
    }
    .btn-update:hover {
      background-color: #2563eb;
    }
    .btn-delete {
      background-color: #ef4444;
    }
    .btn-delete:hover {
      background-color: #b91c1c;
    }
    .success {
      color: #16a34a;
      margin-bottom: 15px;
    }
    .error {
      color: #dc2626;
      margin-bottom: 15px;
    }
    .btn-save {
      background-color: #10b981;
      color: white;
      padding: 6px 12px;
      border: none;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
    }
    .btn-save:hover {
      background-color: #059669;
    }
    .btn-cancel {
      background-color: #6b7280;
      color: white;
      padding: 6px 12px;
      border: none;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
    }
    .btn-cancel:hover {
      background-color: #4b5563;
    }
  `]
})
export class CompetenceListComponent implements OnInit {
  competences: Competence[] = [];
  success = '';
  error = '';
  editingId: number | null = null;
  originalNameMap: { [id: number]: string } = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCompetences();
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  loadCompetences() {
    this.http.get<Competence[]>('http://localhost:8000/api/competences', this.getAuthHeaders())
      .subscribe({
        next: (data) => this.competences = data,
        error: () => this.error = 'Erreur lors du chargement des compétences.'
      });
  }

  startEditing(c: Competence) {
    this.editingId = c.id;
    this.originalNameMap[c.id] = c.name;
  }

  cancelEditing(c: Competence) {
    c.name = this.originalNameMap[c.id];
    this.editingId = null;
  }

  updateCompetence(c: Competence) {
    this.success = '';
    this.error = '';

    const originalName = this.originalNameMap[c.id]?.trim();
    const newName = c.name.trim();

    if (!newName) {
      this.error = 'Le nom de la compétence ne peut pas être vide.';
      return;
    }

    if (newName === originalName) {
      this.error = 'Aucune modification détectée.';
      return;
    }

    this.http.put(`http://localhost:8000/api/competences/${c.id}`, { name: newName }, this.getAuthHeaders())
      .subscribe({
        next: () => {
          this.success = `Compétence "${newName}" modifiée.`;
          this.editingId = null;
        },
        error: (err) => this.error = err.error?.message || 'Erreur lors de la modification.'
      });
  }

  deleteCompetence(id: number) {
    this.success = '';
    this.error = '';

    if (!confirm('Confirmer la suppression ?')) return;

    this.http.delete(`http://localhost:8000/api/competences/${id}`, this.getAuthHeaders())
      .subscribe({
        next: () => {
          this.success = 'Compétence supprimée.';
          this.competences = this.competences.filter(c => c.id !== id);
        },
        error: (err) => this.error = err.error?.message || 'Erreur lors de la suppression.'
      });
  }
}
