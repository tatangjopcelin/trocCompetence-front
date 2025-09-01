import { Component, Input, OnInit } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { UserService, UserWithCompetences } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-group-invite',
  templateUrl: './group-invite.component.html',
  styleUrls: ['./group-invite.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class GroupInviteComponent implements OnInit {
  @Input() groupId!: number; // ID du groupe reçu du parent
  users: UserWithCompetences[] = [];
  selectedUserId: number | null = null;

  constructor(
    private groupService: GroupService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getUsersWithCompetences().subscribe(users => {
      this.users = users;
    });
  }

  invite() {
    if (this.selectedUserId) {
      this.groupService.inviteUserToGroup(this.groupId, this.selectedUserId).subscribe(() => {
        alert('Utilisateur invité !');
        this.selectedUserId = null;
      });
    }
  }

  getCompetencesNames(competences: any[]): string {
    if (!competences || competences.length === 0) {
      return 'Aucune';
    }
    return competences.map(c => c.name).join(', ');
  }
  
}
