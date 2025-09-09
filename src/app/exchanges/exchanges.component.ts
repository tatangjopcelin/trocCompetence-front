import { Component, OnInit } from '@angular/core';
import { ExchangeService } from '../services/exchange.service';
import { ChatComponent } from '../components/chat/chat.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-exchanges',
  templateUrl: './exchanges.component.html',
  imports: [CommonModule, ChatComponent, RouterModule],
  standalone: true,
  styleUrls: ['./exchanges.component.scss']
})
export class ExchangesComponent implements OnInit {
  exchanges: any[] = [];
  selectedExchange: any = null;
  loading: boolean = false;
  error: string | null = null;
  currentUserId: number | null = null;
  chatExchangeId: number | null = null;


  constructor(private exchangeService: ExchangeService) {}

  ngOnInit(): void {
    this.currentUserId = this.getCurrentUserId();
    this.loadMyExchanges();
  }

  getCurrentUserId(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.user?.id || null;
    } catch (e) {
      console.error('Erreur de décodage du token', e);
      return null;
    }
  }

  loadMyExchanges(): void {
    this.loading = true;
    this.error = null;

    this.exchangeService.getMyExchanges().subscribe({
      next: (data) => {
        this.exchanges = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = "Erreur lors du chargement des échanges.";
        this.loading = false;
      }
    });
  }

  viewExchangeDetails(exchangeId: number): void {
    this.selectedExchange = null;
    this.exchangeService.getExchangeById(exchangeId).subscribe({
      next: (data) => {
        this.selectedExchange = data;
      },
      error: (err) => {
        console.error("Erreur getExchangeById :", err);
        alert("Impossible de charger les détails de l’échange.");
      }
    });
  }

  updateStatus(exchangeId: number, status: string): void {
    this.exchangeService.updateStatus(exchangeId, status).subscribe({
      next: () => this.loadMyExchanges(),
      error: (err) => {
        console.error("Erreur updateStatus :", err);
        alert(err.error?.message || "Échec de la mise à jour du statut.");
      }
    });
  }

  deleteExchange(exchangeId: number): void {
    if (!confirm("Voulez-vous vraiment supprimer cet échange ?")) return;

    this.exchangeService.deleteExchange(exchangeId).subscribe({
      next: () => this.loadMyExchanges(),
      error: (err) => {
        console.error("Erreur deleteExchange :", err);
        alert("Échec de la suppression de l’échange.");
      }
    });
  }

  closeDetails(): void {
    this.selectedExchange = null;
  }
  openChat(exchangeId: number): void {
    this.chatExchangeId = exchangeId;
  } 
  closeChat(): void {
    this.chatExchangeId = null;
  }

  
  
}
