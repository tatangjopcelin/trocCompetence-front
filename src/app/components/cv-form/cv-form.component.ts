import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CvService, Cv } from '../../services/cv.service';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-cv-form',
  templateUrl: './cv-form.component.html',
  styleUrls: ['./cv-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CvFormComponent implements OnInit {
  cv: Cv = {
    titre: '',
    profil: '',
    langues: '',
    permis_conduire: '',
    experiences: [],
    formations: [],
    skills: [],
    centresInteret: []
  };

  message = '';

  constructor(private cvService: CvService) {}

  ngOnInit(): void {}

  saveCv() {
   
    // Filtrer et transformer les tableaux
    this.cv.experiences = this.cv.experiences?.filter(e => e.poste && e.entreprise) || [];
    this.cv.formations = this.cv.formations?.filter(f => f.diplome && f.etablissement) || [];
    
    // Transformer skills -> nom
    this.cv.skills = this.cv.skills?.filter(s => s.name).map(s => ({
      name: s.name,
      niveau: s.niveau
    })) || [];
  
    // Transformer centresInteret -> nom
    this.cv.centresInteret = this.cv.centresInteret?.filter(c => c.name).map(c => ({
      name: c.name
    })) || [];
  
    this.cvService.createCv(this.cv).subscribe({
      next: res => {
        this.message = '✅ CV créé avec succès';
        console.log('CV créé:', res);
      },
      error: err => {
        console.error('Erreur backend:', err);
        if (err.status === 422) {
          this.message = '❌ Erreurs de validation : ' + JSON.stringify(err.error.errors);
        } else {
          this.message = '❌ Erreur lors de la création';
        }
      }
    });
  }


  downloadCv() {
    const DATA: any = document.getElementById('cv-pdf');
    if (!DATA) return;
  
    // Afficher temporairement le div caché pour capturer
    DATA.style.display = 'block';
  
    html2canvas(DATA, { scale: 2 }).then(canvas => {
      const imgWidth = 210; // largeur A4 en mm
      const pageHeight = 297; // hauteur A4 en mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
  
      const contentDataURL = canvas.toDataURL('image/png');
  
      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save(`${this.cv.titre || 'Mon_CV'}.pdf`);
  
      // Re-cacher le div
      DATA.style.display = 'none';
    });
  }
  
  
}
