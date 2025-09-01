import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { ExchangeService } from '../../services/exchange.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SearchResultsComponent implements OnInit {
  competence: string = '';
  type: string = 'proposee';
  results: any[] = [];
  loading = false;
  error: string | null = null;
  messageMap: { [userId: number]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService,
    private exchangeService: ExchangeService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.competence = params['competence'] || '';
      this.type = params['type'] || 'proposee';
      if (this.competence) {
        this.performSearch();
      }
    });
  }

  performSearch(): void {
    this.loading = true;
    this.error = null;
    this.searchService.searchCompetence(this.competence, this.type).subscribe({
      next: (data) => {
        this.results = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = "Erreur lors de la recherche.";
        this.loading = false;
      }
    });
  }

  demanderEchange(user2Id: number): void {
    this.exchangeService.createExchange(user2Id).subscribe({
      next: () => {
        this.messageMap[user2Id] = '✅ Demande envoyée avec succès.';
      },
      error: (err) => {
        if (err.status === 409) {
          this.messageMap[user2Id] = '⚠️ Un échange existe déjà avec cet utilisateur.';
        } else if (err.status === 422) {
          this.messageMap[user2Id] = '❌ Vous ne pouvez pas vous contacter vous-même.';
        } else {
          this.messageMap[user2Id] = '❌ Erreur lors de l’envoi de la demande.';
        }
      }
    });
  }
}
