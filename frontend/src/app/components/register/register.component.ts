import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { NavComponent } from '../login/nav/nav.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NavComponent,
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isSubmitting = false;
  constructor(
    private fb: FormBuilder,
    private authSvc: AuthService,
    private router: Router
  ){}

  ngOnInit(): void {
      this.registerForm = this.fb.group({
        firstName:    ['', Validators.required],
        lastName:     ['', Validators.required],
        password:     ['', [Validators.required, Validators.minLength(6)]],
        email:        ['', [Validators.required, Validators.email]],
        phoneNumber:  ['', [Validators.required, Validators.minLength(10)]]
      });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;

    // แทนที่การใช้ FormData เนื่องจากไม่ต้องอัพโหลดภาพสำหรับ role manager
    const payload = this.registerForm.value;

    this.authSvc.register('manager', payload).subscribe({
      next: () => {
        console.log('ลงทะเบียนสำเร็จ');
        this.isSubmitting = false;
        this.router.navigate(['/login']);
      },
      error: err => {
        console.error(err);
        this.isSubmitting = false;
      }
    });
  }
}
 