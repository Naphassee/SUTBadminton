import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NavComponent } from "./nav/nav.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NavComponent,
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(
    private authSvc: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.authSvc
      .login('manager', {email: this.email, password: this.password})
      .subscribe({
        next: (res) => {
          this.router.navigate(['/manager'])
        },
        error: (err) => {
          alert(err.error.msg || 'เข้าสู่ระบบไม่สำเร็จ');
          console.error(err);
        }
      });
  }
}