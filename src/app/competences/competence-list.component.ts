import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CompetencelistService, Competence } from '../services/competencelist.service';

@Component({
  selector: 'app-competence-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './competence-list.component.html',
  styleUrls: ['./competence-list.component.scss']
})
export class CompetenceListComponent implements OnInit {
  competences: Competence[] = [];
  success = '';
  error = '';
  editingId: number | null = null;
  originalNameMap: { [id: number]: string } = {};
  currentUserId: number | null = null;

  constructor(
    private competenceService: CompetencelistService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    this.competenceService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUserId = user.id;
        this.loadCompetences();
      },
      error: () => {
        this.error = 'Impossible de récupérer l’utilisateur connecté.';
        this.loadCompetences(); // Charge quand même pour éviter un écran vide
      }
    });
  }

  loadCompetences() {
    this.competenceService.getCompetences().subscribe({
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

    this.competenceService.updateCompetence(c.id, newName).subscribe({
      next: () => {
        this.success = `Compétence "${newName}" modifiée.`;
        this.editingId = null;
        this.loadCompetences();
      },
      error: (err) => this.error = err.error?.message || 'Erreur lors de la modification.'
    });
  }

  deleteCompetence(id: number) {
    this.success = '';
    this.error = '';

    if (!confirm('Confirmer la suppression ?')) return;

    this.competenceService.deleteCompetence(id).subscribe({
      next: () => {
        this.success = 'Compétence supprimée.';
        this.competences = this.competences.filter(c => c.id !== id);
      },
      error: (err) => this.error = err.error?.message || 'Erreur lors de la suppression.'
    });
  }

  goToManage() {
    this.router.navigate(['/pro-rechcompetences']);
  }
}
