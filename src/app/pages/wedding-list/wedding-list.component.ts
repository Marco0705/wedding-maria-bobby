import { Component, inject, OnInit } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-wedding-list',
  templateUrl: './wedding-list.component.html',
  styleUrls: ['./wedding-list.component.css'],
})
export class WeddingListComponent {
  
  protected translate = inject(TranslationService);

  copied = false;

  copyToClipboard(text: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        this.copied = true;
        setTimeout(() => (this.copied = false), 1000); // 1 segundo
      })
      .catch(() => {
        console.error('No se pudo copiar al portapapeles');
      });
  }
}
