import { Component, OnInit } from '@angular/core';
import { NavComponent } from "../nav/nav.component"; // นำเข้าคอมโพเนนต์ NavComponent
import { RegistrationService } from '../../../core/services/registration.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { AppConfig } from '../../../app.config';

declare var bootstrap: any;

@Component({
  selector: 'app-payment',
  standalone: true, // ใช้ standalone component
  imports: [
    NavComponent,
    CommonModule  
  ],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  // เก็บข้อมูล registrations ที่ดึงมาจาก backend
  registrations: any[] = [];

  // เก็บ id ของ Registration ที่กด “แนบสลิป” ไว้
  selectedRegId: string | null = null;

  // เก็บไฟล์สลิปที่ผู้ใช้เลือก
  selectedSlipFile: File | null = null;

  selectedRegistration: any;

  qrCode!: string;

  showSuccessAlert = false;

  constructor(
    private regService: RegistrationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadRegistrations();
    console.log(this.selectedRegistration);
  }

  // 1) โหลดค่าทั้งหมดที่ Manager เคยสมัคร (พร้อม tournament → organizer.qrCode, players ฯลฯ)
  loadRegistrations(): void {
    const managerId = this.authService.getUserId(); // ตัวอย่าง: ดึง managerId จาก token/session
    this.regService.getRegByManager(managerId).subscribe({
      next: res => {
        // Backend ส่ง { registrations: [...] }
        this.registrations = res.registrations;
      },
      error: err => {
        console.error('Load registrations error:', err);
        alert('เกิดข้อผิดพลาดตอนโหลดข้อมูล');
      }
    });
  }

  // 2) เมื่อกดปุ่ม “แนบสลิป” ของแถวไหน ให้บันทึก id ของ registration นั้นเพื่อเอาไปใช้ upload
  onSelectSlip(regId: string): void {
    this.selectedRegId = regId;
    this.selectedSlipFile = null; // ล้างไฟล์เก่าออก (ถ้ามี)
  }

  onSelectQr(Qr: string): void {
    this.qrCode = Qr
  }

  showQr(): string {
    return this.getBannerUrl(this.qrCode)
  } 

  // 3) รับ event เมื่อผู้ใช้เลือกไฟล์สลิป (จาก <input type="file">)
  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedSlipFile = event.target.files[0];
    }
  }

  getBannerUrl(file: string) {
      return `${AppConfig.uploadUrl}${file}`;
  }

// 4) ส่งสลิปขึ้น backend (/uploadSlip) แล้วโหลดข้อมูลใหม่
  onSubmitSlip(): void {
    if (!this.selectedRegId || !this.selectedSlipFile) {
      alert('ต้องเลือกรายการและไฟล์ก่อน');
      return;
    }

    this.regService.uploadSlip(this.selectedRegId, this.selectedSlipFile).subscribe({
      next: (res) => {
        alert('แนบสลิปสำเร็จ');
        this.loadRegistrations();  // โหลดข้อมูลใหม่ เพื่ออัปเดตสถานะ / รูปสลิป ฯลฯ
        this.selectedSlipFile = null;
        this.selectedRegId = null;
      },
      error: (err) => {
        console.error(err);
        alert('เกิดข้อผิดพลาดตอนอัปโหลดสลิป');
      }
    });
  }
  confirmAction() {
    // ทำงานเมื่อกดยืนยันใน modal
    this.onSubmitSlip(); // เรียกฟังก์ชันที่คุณมีอยู่แล้ว
    this.showSuccessAlert = true;

    // ซ่อน alert หลัง 3 วินาที
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 3000);
    const toastEl = document.getElementById('paysuccessToast');
  if (toastEl) {
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  }
  }


}