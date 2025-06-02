import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule  } from '@angular/forms';
import { OrganizerService } from '../../../core/services/organizer.service';
import { RouterModule } from '@angular/router';
import { AppConfig } from '../../../app.config';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [ RouterModule,
             CommonModule,
             ReactiveFormsModule, ],
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
        this.imageSrc  = `${AppConfig.uploadUrl}${org.profileImage}`;
        this.qrCodeSrc = `${AppConfig.uploadUrl}${org.qrCode}`;
      },
      error: err => console.error('ไม่สามารถดึงโปรไฟล์ได้', err)
    });
  }
}