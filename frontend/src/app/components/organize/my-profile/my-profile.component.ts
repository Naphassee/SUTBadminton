import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule  } from '@angular/forms';
import { OrganizerService, Organizer } from '../../../services/organizer.service';
import { RouterModule } from '@angular/router';
// import { LocationAddComponent } from '../location-add/location-add.component';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [ RouterModule,
             CommonModule,
             ReactiveFormsModule,
             /*LocationAddComponent*/ ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit {
  profileForm!: FormGroup;
  imageSrc = '';
  qrCodeSrc = '';

  constructor(
    private fb: FormBuilder,
    private organizerService: OrganizerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // สร้าง form controls
    this.profileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      userName: [''],
      email: [''],
      phoneNumber: ['']
    });

    // เรียก API ดึงโปรไฟล์
    // เรียก API เฉพาะบน browser เท่านั้น
    if (isPlatformBrowser(this.platformId)) {
    this.organizerService.getProfile().subscribe({
      next: org => {
        // patch ข้อมูลลง form
        this.profileForm.patchValue({
          firstName: org.firstName,
          lastName:  org.lastName,
          userName:  org.userName,
          email:     org.email,
          phoneNumber: org.phoneNumber
        });

        // ทำการปิดไม่ให้ช่อง input กรอกข้อมูลได้
        this.profileForm.disable();

        // เตรียม URL รูปภาพ (ขึ้นกับที่คุณเซิร์ฟต์ static ไว้)
        this.imageSrc  = `http://localhost:5000/uploads/${org.profileImage}`;
        this.qrCodeSrc = `http://localhost:5000/uploads/${org.qrCode}`;
      },
      error: err => console.error('ไม่สามารถดึงโปรไฟล์ได้', err)
    });
  }
}

//   title = 'custom-modal-appp';
//   isModalOpen: boolean = false;

//   openModal(){
//     this.isModalOpen = true;
//   }

//  closeModal(){
//     this.isModalOpen = false;
//   }
}