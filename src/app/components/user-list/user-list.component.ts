import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { UserService, UserWithCompetences } from '../../services/user.service';
import { ExchangeService } from '../../services/exchange.service'; // <-- importé
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

  constructor(
    private userService: UserService,
    private exchangeService: ExchangeService // <-- injecté
  ) {}

  ngOnInit() {
    this.userService.getUsersWithCompetences().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des utilisateurs.';
        this.loading = false;
      }
    });
  }

  demanderEchange(user2Id: number) {
    this.exchangeService.createExchange(user2Id).subscribe({
      next: () => {
        this.messageMap[user2Id] = '✅ Demande envoyée avec succès.';
      },
      error: (err) => {
        if (err.status === 409) {
          this.messageMap[user2Id] = '⚠️ Un échange existe déjà avec cet utilisateur.';
        } else if (err.status === 422) {
          this.messageMap[user2Id] = '❌ Vous ne pouvez pas contacter vous-même.';
        } else {
          this.messageMap[user2Id] = '❌ Erreur lors de l’envoi de la demande.';
        }
      }
    });
  }
}
