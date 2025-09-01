import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GroupService, Group } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {
  groups: Group[] = [];
  loading = true;
  error: string | null = null;
  
  currentUserId!: number | null;  // <-- déclaration

  constructor(
    private groupService: GroupService,
    private authService: AuthService
    , private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId();
  
    this.groupService.getUserGroups().subscribe({
      next: data => {
        console.log('Groupes reçus :', data); // 👈 ajoute ceci
        this.groups = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des groupes';
        this.loading = false;
      }
    });
  }
  quitGroup(groupId: number) {
    if(confirm('Voulez-vous quitter ce groupe ?')) {
      this.groupService.removeUser(groupId, this.currentUserId!).subscribe(() => {
        alert('Vous avez quitté le groupe');
        this.router.navigate(['/dashboard']);
        this.ngOnInit();
      });
    }
  }
  
  
}
