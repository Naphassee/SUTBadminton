import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-location-add',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-add.component.html',
  styleUrls: ['./location-add.component.css']
})
export class LocationAddComponent {
  @Input() isOpen: boolean = false; 
  @Input() title: string = 'Modal Title'; 
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }
}
