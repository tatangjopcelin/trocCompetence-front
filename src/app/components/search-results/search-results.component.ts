import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../services/search.service';
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

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService
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
}
