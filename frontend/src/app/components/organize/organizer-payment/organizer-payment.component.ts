import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RegistrationService } from '../../../core/services/registration.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { AppConfig } from '../../../app.config';

@Component({
  selector: 'app-organizer-payment',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './organizer-payment.component.html',
  styleUrl: './organizer-payment.component.css'
})
export class OrganizerPaymentComponent implements OnInit {
   registrations: any[] = [];
  tournamentId!: string;
  organizerId!: string;

  constructor(
    private route: ActivatedRoute,
    private regSvc: RegistrationService,
    private authSvc: AuthService
  ) {}

  ngOnInit(): void {
    // ดึง organizerId จาก token / authService (สมมติ AuthService มี getUserId())
    this.organizerId = this.authSvc.getUserId(); // ให้เป็น ID ของ Organizer ที่ล็อกอิน
    console.log('organizerId →', this.organizerId);

    // ดึง tournamentId จาก URL
    this.route.paramMap.subscribe((snapshot) => {
      const id = snapshot.get('id');
      if (id) {
        this.tournamentId = id;
        console.log('tournamentId →', this.tournamentId);
        this.loadRegistrations();
      }
    });
  }

  // ฟังก์ชันดึงข้อมูล Registration (ดึงด้วย tournamentId+organizerId)
  loadRegistrations(): void {
    this.regSvc.getByTournament(this.tournamentId, this.organizerId)
      .subscribe({
        next: (res) => {
          console.log('ได้ข้อมูลสมัคร:', res);
          this.registrations = res.registrations || [];
        },
        error: (err) => {
          console.error('เกิดข้อผิดพลาด getByTournament:', err);
        }
      });
  }

  // ฟังก์ชันอัปเดตสถานะเมื่อคลิกปุ่ม ยืนยัน
  confirmRegistration(reg: any): void {
    // ส่งค่าผ่าน service เพื่ออัปเดตสถานะเป็น "เสร็จสิ้น" (ตัวอย่าง)
    const newStatus = 'เสร็จสิ้น';

    this.regSvc.updateStatusByOrganizer(reg._id, this.organizerId, newStatus)
      .subscribe({
        next: (res) => {
          console.log('อัปเดตสถานะสำเร็จ:', res);
          // อัปเดตค่าในตารางทันที (หรือจะ reload ใหม่ก็ได้)
          reg.status = newStatus;
        },
        error: (err) => {
          console.error('อัปเดตสถานะผิดพลาด:', err);
        }
      });
  }

  // ปฏิเสธ (Reject) → สถานะเป็น "ปฏิเสธ"
  rejectRegistration(reg: any): void {
    const newStatus = 'ไม่ผ่านการตรวจสอบ';
    this.regSvc.updateStatusByOrganizer(reg._id, this.organizerId, newStatus)
      .subscribe({
        next: (res) => {
          console.log('อัปเดตสถานะเป็น ปฏิเสธ สำเร็จ:', res);
          reg.status = newStatus; // อัปเดตสถานะใน UI ทันที
        },
        error: (err) => {
          console.error('อัปเดตสถานะปฏิเสธผิดพลาด:', err);
        }
      });
  }

  getImageUrl(filePath: string): string {
    if (!filePath) return '';
    // ถ้า filePath ไม่ขึ้นต้น "/" ให้เติม
    if (!filePath.startsWith('/')) {
      filePath = '/' + filePath;
    }
    const full = `${AppConfig.fetchUrl}${filePath}`
    console.log('getImageUrl() คืน full URL =', full);
    return full;
  }
}