import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { UserService, UserWithCompetences } from '../../services/user.service';
import { RouterLink } from '@angular/router'; // Import RouterLink for navigation


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

  constructor(private userService: UserService) {}

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
}
