import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, UserWithCompetences, UserProfile } from '../../services/user.service';
import { ExchangeService } from '../../services/exchange.service';
import { AvailabilityService, Availability } from '../../services/availability.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class UserListComponent implements OnInit {
  users: UserWithCompetences[] = [];
  loading = true;
  error: string | null = null;
  messageMap: { [userId: number]: string } = {};
  currentUser: UserProfile | null = null;
  myAvailabilities: Availability[] = []; // <-- Mes disponibilités

  constructor(
    private userService: UserService,
    private exchangeService: ExchangeService,
    private availabilityService: AvailabilityService
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.userService.getProfile().subscribe({
        next: (user) => {
          this.currentUser = user;
          // 🔹 Charger les dispos du user connecté
          this.loadMyAvailabilities();
        },
        error: () => console.warn('Impossible de récupérer le profil connecté.')
      });
    }

    this.userService.getUsersWithCompetences().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des utilisateurs.';
        this.loading = false;
      },
    });
  }

  loadMyAvailabilities() {
    if (!this.currentUser) return;
    this.availabilityService.getAvailabilities().subscribe({
      next: (data) => {
        // On filtre seulement les disponibilités du user connecté
        this.myAvailabilities = data.filter(d => d.user_name === this.currentUser!.name);
      },
      error: (err) => console.error(err)
    });
  }

  demanderEchange(user2Id: number) {
    this.exchangeService.createExchange(user2Id).subscribe({
      next: () => this.messageMap[user2Id] = '✅ Demande envoyée avec succès.',
      error: (err) => {
        if (err.status === 409) this.messageMap[user2Id] = '⚠️ Un échange existe déjà avec cet utilisateur.';
        else if (err.status === 422) this.messageMap[user2Id] = '❌ Vous ne pouvez pas contacter vous-même.';
        else this.messageMap[user2Id] = '❌ Erreur lors de l’envoi de la demande.';
      },
    });
  }

  supprimerUser(userId: number) {
    if (!confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return;
    this.userService.deleteUser(userId).subscribe({
      next: () => this.users = this.users.filter(u => u.id !== userId),
      error: () => alert('Erreur lors de la suppression de l’utilisateur.')
    });
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  // 🔹 Nouvelle méthode pour associer une dispo à une compétence
  associerDisponibilite(availabilityId: number, competenceId: number) {
    this.availabilityService.attachCompetenceToAvailability(availabilityId, competenceId)
      .subscribe({
        next: () => {
          this.messageMap[this.currentUser!.id] = '✅ Disponibilité associée à la compétence.';
        },
        error: (err) => {
          console.error(err);
          this.messageMap[this.currentUser!.id] = '❌ Impossible d’associer la disponibilité.';
        }
      });
  }
}
