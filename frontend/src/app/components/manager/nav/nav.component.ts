import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyProfileComponent } from "../../organize/my-profile/my-profile.component";
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ManagerService } from '../../../core/services/manager.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MyProfileComponent, RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit, AfterViewInit {
  profileForm!: FormGroup;
  private toastInstance: any; // ✅ แก้ไข: เพิ่มตัวแปร toastInstance

  constructor(
    private fb: FormBuilder,
    private mymanagerService: ManagerService,
    public authSvc: AuthService,
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{9,10}$/)]]
    });

    this.loadProfile(); // ✅ เรียกใช้เมธอดที่เราจะสร้าง
  }

  ngAfterViewInit(): void {
    const toastEl = document.getElementById('successToast');
    if (toastEl) {
      this.toastInstance = new bootstrap.Toast(toastEl); // ✅ สร้าง Toast instance
    }
  }

  // ✅ เพิ่มเมธอด loadProfile
  loadProfile(): void {
    this.mymanagerService.getProfile().subscribe({
      next: org => {
        this.profileForm.patchValue(org);
      },
      error: (err: any) => {
        alert('ไม่สามารถดึงโปรไฟล์ได้');
        console.error(err);
      }
    });
  }

  confirmUpdate(): void {
    if (this.profileForm.invalid) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง');
      this.profileForm.markAllAsTouched();
      return;
    }

    const updateData = this.profileForm.value;
    const managerId = this.authSvc.getUserId();

    this.mymanagerService.updateProfile(managerId, updateData).subscribe({
      next: (res) => {
        this.profileForm.patchValue(res);

        const confirmModalEl = document.getElementById('confirmUpdateModal');
        const editModalEl = document.getElementById('editprofile');
        if (confirmModalEl) {
          const confirmModal = bootstrap.Modal.getInstance(confirmModalEl);
          confirmModal?.hide();
        }
        if (editModalEl) {
          const editModal = bootstrap.Modal.getInstance(editModalEl);
          editModal?.hide();
        }

        this.loadProfile();            // ✅ โหลดข้อมูลใหม่หลังอัปเดต
        this.toastInstance?.show();    // ✅ แสดง Toast แจ้งเตือน
      },
      error: (err) => {
        alert('เกิดข้อผิดพลาดในการอัปเดต');
        console.error(err);
      }
    });
  }
}
