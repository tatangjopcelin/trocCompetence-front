import { Component, OnInit } from '@angular/core';
import { GroupService, Group } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';  
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-group-manage',
  templateUrl: './group-manage.component.html',
  styleUrls: ['./group-manage.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class GroupManageComponent implements OnInit {
  groupId!: number;
  group!: Group | null;
  currentUserId!: number | null;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUserId = this.authService.getCurrentUserId();

    const idParam = this.route.snapshot.paramMap.get('groupId');
    if (idParam) {
      this.groupId = +idParam;
      this.loadGroup();
    } else {
      console.error('Aucun ID de groupe trouvé dans l’URL.');
      this.group = null;
    }
  }

  loadGroup() {
    this.groupService.getGroup(this.groupId).subscribe({
      next: (group) => {
        this.group = group;
      },
      error: (err) => {
        console.error('Erreur lors du chargement du groupe:', err);
        this.group = null;
      }
    });
  }

  removeUser(userId: number) {
    if (!this.isCreator()) {
      alert("Seul le créateur peut retirer des membres.");
      return;
    }
    if (confirm('Voulez-vous vraiment retirer cet utilisateur ?')) {
      this.groupService.removeUser(this.groupId, userId).subscribe({
        next: () => {
          
          this.loadGroup();
        },
        error: (err) => {
          console.error('Erreur lors du retrait:', err);
          alert("Erreur lors du retrait de l'utilisateur.");
        }
      });
    }
  }

  quitGroup() {
    if (!this.currentUserId) {
      alert("Utilisateur non identifié.");
      return;
    }
    if (confirm('Voulez-vous quitter ce groupe ?')) {
      this.groupService.removeUser(this.groupId, this.currentUserId).subscribe({
        next: () => {
          
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Erreur lors de la sortie du groupe:', err);
          alert("Impossible de quitter le groupe.");
        }
      });
    }
  }

  isCreator(): boolean {
    return this.group !== null && this.currentUserId === this.group.user_id;
  }
}
