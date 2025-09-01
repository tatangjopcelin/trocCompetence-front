import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService, Message } from '../../services/message.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ChatComponent implements OnInit, OnChanges {
  @Input() exchangeId!: number;

  messages: Message[] = [];
  newMessage = '';
  selectedFile: File | null = null;
  currentUserId: number | null = null;
  loading = false;
  error: string | null = null;
  

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.messageService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUserId = user.id;
        this.loadMessages(); 
        setInterval(() => this.loadMessages(), 3000);
      },
      error: () => {
        this.error = "Erreur lors de la récupération de l'utilisateur";
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['exchangeId'] && !changes['exchangeId'].firstChange) {
      this.loadMessages(); // Recharge les messages si exchangeId change
    }
  }

  loadMessages() {
    this.loading = true;
    this.messageService.getMessages().subscribe({
      next: (data) => {
        this.messages = data.filter(m => m.exchange_id === this.exchangeId);
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur de chargement des messages';
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  sendMessage() {
    if (!this.exchangeId || (!this.newMessage && !this.selectedFile)) return;
  
    this.messageService.sendMessage(this.exchangeId, this.newMessage, this.selectedFile!).subscribe({
      next: () => {
        this.newMessage = '';
        this.selectedFile = null;
        this.loadMessages(); // Recharge les messages après envoi
      },
      error: () => {
        this.error = 'Échec de l’envoi du message';
      }
    });
  }

  isMyMessage(message: Message): boolean {
    return this.currentUserId === message.user_id;
  }
}
