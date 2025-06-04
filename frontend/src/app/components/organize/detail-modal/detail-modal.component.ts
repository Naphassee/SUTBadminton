import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tournament } from '../../../core/services/tournament.service';
import { AppConfig } from '../../../app.config';

@Component({
  selector: 'app-detail-modal',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './detail-modal.component.html',
  styleUrl: './detail-modal.component.css'
})
export class DetailModalComponent {
  @Input() tournament?: Tournament;
  @Output() close = new EventEmitter<void>();

  getBannerUrl(file: string) {
    return `${AppConfig.uploadUrl}${file}`;
  }
}
