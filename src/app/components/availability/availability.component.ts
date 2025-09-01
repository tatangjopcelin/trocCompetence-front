import { Component, OnInit } from '@angular/core';
import { Availability, AvailabilityService } from '../../services/availability.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class AvailabilityComponent implements OnInit {
  availabilities: Availability[] = [];
  newAvailability: Partial<Availability> = {};
  editingAvailabilityId: number | null = null;
  editAvailabilityData: Partial<Availability> = {};
  errorMessage: string = '';

  constructor(private availabilityService: AvailabilityService) {}

  ngOnInit(): void {
    this.loadAvailabilities();
  }

  // Charger toutes les dispos
  loadAvailabilities() {
    this.availabilityService.getAvailabilities().subscribe({
      next: data => this.availabilities = data,
      error: err => console.error('Erreur load', err)
    });
  }

  // Ajouter une dispo
  addAvailability() {
    if (this.newAvailability.date && this.newAvailability.start_time && this.newAvailability.end_time) {
      const payload = this.formatPayload(this.newAvailability);
      console.log("Payload envoyé :", payload);
  
      this.availabilityService.createAvailability(payload).subscribe({
        next: () => {
          this.loadAvailabilities();
          this.newAvailability = {};
          this.errorMessage = ''; // réinitialiser le message après succès
        },
        error: err => {
          if (err.status === 403 && err.error?.error) {
            this.errorMessage = err.error.error; // "Vous avez déjà créé une disponibilité."
          } else {
            this.errorMessage = 'Une erreur est survenue lors de la création.';
            console.error('Erreur create', err);
          }
        }
      });
    }
  }
  
  

  // Supprimer une dispo
  deleteAvailability(id: number) {
    this.availabilityService.deleteAvailability(id).subscribe({
      next: () => this.loadAvailabilities(),
      error: err => console.error('Erreur delete', err)
    });
  }

  // Démarrer l’édition
  startEdit(a: Availability) {
    this.editingAvailabilityId = a.id;
    this.editAvailabilityData = { ...a };
  }

  // Annuler l’édition
  cancelEdit() {
    this.editingAvailabilityId = null;
    this.editAvailabilityData = {};
  }

  // Sauvegarder la modification
  saveEdit() {
    if (this.editingAvailabilityId && this.editAvailabilityData.date && this.editAvailabilityData.start_time && this.editAvailabilityData.end_time) {
      const payload = this.formatPayload(this.editAvailabilityData);

      console.log('Payload envoyé:', payload);

      this.availabilityService.updateAvailability(this.editingAvailabilityId, payload)
        .subscribe({
          next: () => {
            this.loadAvailabilities();
            this.cancelEdit();
          },
          error: err => console.error('Erreur update', err)
        });
    }
  }

  // Préparer les données pour Laravel (formats corrects)
  private formatPayload(data: Partial<Availability>) {
    return {
      date: data.date || '',
      start_time: this.formatTime(data.start_time),
      end_time: this.formatTime(data.end_time),
    };
  }

  // Forcer format HH:mm
  private formatTime(time: string | undefined): string {
    if (!time) return '';
    const [h, m] = time.split(':');
    return `${h.padStart(2,'0')}:${m.padStart(2,'0')}`;
  }
}
