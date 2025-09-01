import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
})
export class EditProfileComponent implements OnInit {
  // FormGroup initialisé dès le départ
  profileForm: FormGroup;

  loading = false;
  error = '';
  success = '';

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    // Charger l’utilisateur actuel et remplir le formulaire
    this.userService.getProfile().subscribe(user => {
      this.profileForm.patchValue({
        name: user.name,
        email: user.email,
      });
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    this.loading = true;
    this.error = '';
    this.success = '';

    this.userService.updateProfile(this.profileForm.value).subscribe({
      next: () => {
        this.success = 'Profil mis à jour avec succès ✅';
        this.loading = false;
         // 🔹 Redirection vers la page profil après 1s (pour voir le message succès)
      setTimeout(() => {
        this.router.navigate(['/profile']); // <-- mettre ici la route de la page profil
      }, 300);
      },
      error: () => {
        this.error = 'Erreur lors de la mise à jour';
        this.loading = false;
      },
    });
  }
}
