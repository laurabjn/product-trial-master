import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private messageService: MessageService) {}

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Succès', detail: message });
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: message });
  }
}