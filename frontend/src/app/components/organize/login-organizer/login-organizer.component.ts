import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
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
    private authSvc: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.authSvc
      .login('organizer', { userName: this.userName, password: this.password })
      .subscribe({
        next: (res) => {
          /* 
            ปกติจะเก็บ token ไว้ใช้งานตอนเรียก API ถัดไปโดยใช้ ==> localStorage.setItem('token', res.token);
            
            ไม่ต้องเขียน localStorage.setItem('token', …) อีกทีก็ได้ เพราะ AuthService.tap() เก็บให้แล้ว แค่เรียก this.authSvc.login(...) ก็เรียบร้อย
          */

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
