import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OrganizerService } from '../../../services/organizer.service';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login-organizer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './login-organizer.component.html',
  styleUrls: ['./login-organizer.component.css']
})
export class LoginOrganizerComponent {
  userName = '';
  password = '';

  constructor(
    private organizerService: OrganizerService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.organizerService
      .login({ userName: this.userName, password: this.password })
      .subscribe({
        next: (res) => {
          // เก็บ token ไว้ใช้งานตอนเรียก API ถัดไป
          localStorage.setItem('token', res.token);
          // ไปหน้าหลักหรือ dashboard
          this.router.navigate(['/organize']);
        },
        error: (err) => {
          // แสดงข้อผิดพลาดจาก backend (err.error.msg)
          alert(err.error.msg || 'เข้าสู่ระบบไม่สำเร็จ');
          console.error(err);
        }
      });
  }
}
