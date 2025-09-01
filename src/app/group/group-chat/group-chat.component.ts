import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupService, GroupMessage } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { UserService, UserWithCompetences } from '../../services/user.service';

@Component({
  selector: 'app-group-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.scss']
})
export class GroupChatComponent implements OnInit {
  groupId!: number;
  messages: GroupMessage[] = [];
  newMessage = '';
  selectedFile: File | null = null;
  error: string | null = null;
  loading = false;
  currentUserId!: string;

  // Invitation
  allUsers: UserWithCompetences[] = [];
  selectedUserId: number | null = null;
  inviteMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.groupId = Number(this.route.snapshot.paramMap.get('id'));
    const userId = this.authService.getCurrentUserId();
    this.currentUserId = userId !== null ? userId.toString() : '';

    this.loadMessages();
    this.loadUsers();

    // Rafraîchissement automatique
    setInterval(() => this.loadMessages(), 10000);
  }

  loadMessages() {
    this.loading = true;
    this.groupService.getMessages(this.groupId).subscribe({
      next: (messages) => {
        this.messages = messages;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des messages.';
        this.loading = false;
      }
    });
  }

  loadUsers() {
    this.userService.getUsersWithCompetences().subscribe({
      next: (users) => {
        // Ne proposer que les utilisateurs qui ne sont pas déjà dans le groupe
        this.allUsers = users.filter(
          (u) => !this.messages.some((m) => m.user.id === u.id)
        );
      },
      error: () => {
        console.error("Erreur lors du chargement des utilisateurs.");
      }
    });
  }

  inviteUser() {
    if (!this.selectedUserId) return;

    this.groupService.inviteUserToGroup(this.groupId, this.selectedUserId).subscribe({
      next: () => {
        this.inviteMessage = 'Utilisateur invité avec succès.';
        this.selectedUserId = null;
        this.loadMessages(); // Recharge les messages pour afficher les nouveaux membres
      },
      error: () => {
        this.inviteMessage = "Erreur lors de l'invitation.";
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  sendMessage() {
    if (!this.newMessage.trim() && !this.selectedFile) return;

    this.groupService
      .sendMessage(this.groupId, this.newMessage, this.selectedFile!)
      .subscribe({
        next: () => {
          this.newMessage = '';
          this.selectedFile = null;
          this.loadMessages();
        },
        error: () => {
          this.error = "Erreur lors de l'envoi du message.";
        }
      });
  }

  isImage(filePath: string | null): boolean {
    return filePath !== null && /\.(jpg|jpeg|png)$/i.test(filePath);
  }

  getFileUrl(path: string): string {
    return `http://localhost:8000/storage/${path}`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
