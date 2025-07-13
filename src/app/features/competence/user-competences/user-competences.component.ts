import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <== important pour ngModel
import { CompetenceService } from '../../../services/competence.service';

@Component({
  selector: 'app-user-competences',
  templateUrl: './user-competences.component.html',
  styleUrls: ['./user-competences.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule], // <== important
})
export class UserCompetencesComponent implements OnInit {
  proposees: any[] = [];
  recherchees: any[] = [];
  allCompetences: any[] = [];

  selectedCompetenceId = 0;
  selectedType: 'proposee' | 'recherchee' = 'proposee';

  constructor(private competenceService: CompetenceService) {}

  ngOnInit(): void {
    this.loadCompetences();
    this.loadAllCompetences();
  }

  loadCompetences() {
    this.competenceService.getUserCompetences().subscribe({
      next: (data) => {
        console.log('Compétences récupérées :', data);

        this.proposees = data.proposees;
        this.recherchees = data.recherchees;
      },
      error: (err) => console.error(err)
    });
  }

  loadAllCompetences() {
    this.competenceService.getAllCompetences().subscribe({
      next: (data) => {

        this.allCompetences = data;
      },
      error: (err) => console.error(err)
    });
  }

  addCompetence() {
    if (!this.selectedCompetenceId) return;

    this.competenceService.addCompetence(this.selectedCompetenceId, this.selectedType).subscribe({
      next: () => {
        this.selectedCompetenceId = 0;
        this.loadCompetences();
      },
      error: (err) => console.error(err)
    });
  }

  updateType(competenceId: number, type: 'proposee' | 'recherchee') {
    this.competenceService.updateCompetenceType(competenceId, type).subscribe(() => {
      this.loadCompetences();
    });
  }

  deleteCompetence(competenceId: number) {
    this.competenceService.deleteCompetence(competenceId).subscribe(() => {
      this.loadCompetences();
    });
  }
}
