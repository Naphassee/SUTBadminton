import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LocationAddComponent } from '../location-add/location-add.component';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [ RouterModule, CommonModule, LocationAddComponent ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent {
  /*จัดการแสดงผลรูปภาพที่อินพุตเข้ามา*/
  imageSrc: string | ArrayBuffer | null = null;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(file);
    }
  }

  title = 'custom-modal-appp';
  isModalOpen: boolean = false;

  openModal(){
    this.isModalOpen = true;
  }

 closeModal(){
    this.isModalOpen = false;
  }
}