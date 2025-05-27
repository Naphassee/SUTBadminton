import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule  } from '@angular/forms';
import { OrganizerService } from '../../../core/services/organizer.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ RouterModule,
             CommonModule,
             ReactiveFormsModule,],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit{
  organizerId!: string;
  profileForm!: FormGroup;
  imageSrc = '';
  qrCodeSrc = '';
  profileImageFile?: File;
  qrCodeFile?: File;

  constructor(
    private fb: FormBuilder,
    private organizerService: OrganizerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // สร้าง form controls
    this.profileForm = this.fb.group({
      firstName:        [''],
      lastName:         [''],
      userName:         [{ value: '', disabled: true }], // readonly :contentReference[oaicite:0]{index=0}
      email:            [{ value: '', disabled: true }], // readonly :contentReference[oaicite:1]{index=1}
      phoneNumber:      [''],
      currentPassword:  [''],  // กรณีเปลี่ยนรหัส
      newPassword:      ['']   // กรณีเปลี่ยนรหัส
    });

    // เรียก API ดึงโปรไฟล์
    this.organizerService.getProfile().subscribe({
      next: org => {
        // เก็บ id ไว้ใช้ตอน submit
        this.organizerId = org._id;

        // patch ข้อมูลลง form
        this.profileForm.patchValue({
          firstName:   org.firstName,
          lastName:    org.lastName,
          userName:    org.userName,
          email:       org.email,
          password:    org.password,
          phoneNumber: org.phoneNumber
        });

        // เตรียม URL รูปภาพ (ขึ้นกับที่คุณเซิร์ฟต์ static ไว้)
        this.imageSrc  = `http://localhost:5000/uploads/${org.profileImage}`;
        this.qrCodeSrc = `http://localhost:5000/uploads/${org.qrCode}`;
      },
      error: err => console.error('ไม่สามารถดึงโปรไฟล์ได้', err)
    });
  }

  onFileChange(event: Event, type: 'profileImage' | 'qrCode'): void {
    // 1. แปลง event.target เป็น HTMLInputElement เพื่อเข้าถึง .files
    const input = event.target as HTMLInputElement;

    // 2. ถ้าไม่มีไฟล์เลย ก็ไม่ต้องทำอะไรต่อ
    if (!input.files || input.files.length === 0) {
      return;
    }

    // 3. ดึงไฟล์ตัวแรกจากไฟล์ลิสต์
    const file: File = input.files[0];

    // 4. เก็บไฟล์ลงตัวแปรที่ประกาศไว้
    if (type === 'profileImage') {
      this.profileImageFile = file;
    } else {
      this.qrCodeFile = file;
    }
    this.imageSrc = URL.createObjectURL(file);
  }

  submit() {
    if (this.profileForm.invalid) return;

    const formData = new FormData();
    // ฟิลด์ที่แก้ไขได้
    ['firstName','lastName','phoneNumber','currentPassword','newPassword']
      .forEach(key => {
        const val = this.profileForm.get(key)?.value;
        if (val) formData.append(key, val);
      });
    if (this.profileImageFile) formData.append('profileImage', this.profileImageFile);
    if (this.qrCodeFile)       formData.append('qrCode', this.qrCodeFile);

    // เรียก API อัพเดต พร้อม id จริง
    this.organizerService
      .updateProfile(this.organizerId, formData)
      .subscribe({
        next: () => this.router.navigate(['/organize','my-profile']),
        error: err => console.error(err)
    });
  }
}
