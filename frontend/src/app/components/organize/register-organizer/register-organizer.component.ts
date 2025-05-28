import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register-organizer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './register-organizer.component.html',
  styleUrls: ['./register-organizer.component.css']
})
export class RegisterOrganizerComponent implements OnInit {
  registerForm!: FormGroup;
  isSubmitting = false;

  // สองตัวแปรสำหรับ preview
  imageSrc: string | ArrayBuffer | null = null;
  qrImageSrc: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private authSvc: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
      // กำหนดโครงสร้างฟอร์ม และ validators
      this.registerForm = this.fb.group({
        firstName:    ['', Validators.required],
        lastName:     ['', Validators.required],
        userName:     ['', Validators.required],
        password:     ['', [Validators.required, Validators.minLength(6)]],
        email:        ['', [Validators.required, Validators.email]],
        phoneNumber:  ['', [Validators.required, Validators.minLength(10)]],

        // รูปภาพ
        profileImage: [null],
        qrCode:       [null]
      });
  }

  // อ่านไฟล์จาก input แล้ว patch ค่าลง form
  onFileSelected(event: Event, control: 'profileImage' | 'qrCode'): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    if (!file) return;

    // patch ค่า file ลงใน form
    this.registerForm.patchValue({ [control]: file });
    // บอก Angular ว่ามีค่าลงมาแล้ว
    this.registerForm.get(control)!.updateValueAndValidity();

    // อ่านไฟล์เพื่อ preview
    const reader = new FileReader();
    reader.onload = () => {
      if (control === 'profileImage') {
        this.imageSrc = reader.result;
      } else {
        this.qrImageSrc = reader.result;
      }
    };
    reader.readAsDataURL(file);
  }

  // เมธอดเรียก service เพื่อส่งข้อมูล
  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;

    // รวมข้อมูลเป็น FormData (เพราะมีไฟล์)
    const formData = new FormData();
    Object.entries(this.registerForm.value)
      .forEach(([key, val]) => {
        if (val != null) formData.append(key, val as any);
      });

    // เรียก service
    this.authSvc.register('organizer', formData).subscribe({
      next: () => {
        console.log('ลงทะเบียนสำเร็จ');
        // TODO: navigate หรือแสดง toast
        this.isSubmitting = false;
        // ไปยังหน้า my-tournament
        this.router.navigate(['/login-organizer']);
      },
      error: err => {
        console.error(err);
        this.isSubmitting = false;
      }
    });
  }
}
