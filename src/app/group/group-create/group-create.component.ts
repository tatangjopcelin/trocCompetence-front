import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-group-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.scss']
})
export class GroupCreateComponent {
  groupName = '';
  error: string | null = null;
  success = false;

  constructor(private groupService: GroupService, private router: Router) {}

  createGroup() {
    if (!this.groupName.trim()) {
      this.error = 'Le nom du groupe est requis.';
      return;
    }

    this.groupService.createGroup(this.groupName).subscribe({
      next: (group) => {
        this.success = true;
        this.router.navigate(['/group', group.id]);
      },
      error: () => {
        this.error = 'Erreur lors de la création du groupe.';
      }
    });
  }
}
