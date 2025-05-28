import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router }     from '@angular/router';
import { tap }        from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app.config';

export type Role = 'organizer' | 'manager' | 'admin';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isBrowser: boolean;
  private tokenKey = 'token';
  private roleKey  = 'userRole';

  // เอา apiUrl จาก AppConfig มาเก็บเป็น baseUrl
  private baseUrl = AppConfig.apiUrl;

  

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
) {
  // กำหนด flag ว่าเรารันบนเบราว์เซอร์หรือไม่
    this.isBrowser = isPlatformBrowser(this.platformId);
}

  // REGISTER: /api/{role}s/register
  register(role: Role, creds: any): Observable<{ token: string }> {
    const url = `${this.baseUrl}/auth/${role}s/register`;

    return this.http.post<{ token: string }>(url, creds).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
        localStorage.setItem(this.roleKey, role);
    })
  );
}

  // LOGIN: /api/{role}s/login
  login(role: Role, creds: { userName: string; password: string; } | { email: string; password: string; } ): Observable<{ token: string }> {
    const url = `${this.baseUrl}/auth/${role}s/login`;

    return this.http.post<{ token: string }>(url, creds).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
        localStorage.setItem(this.roleKey, role);
      })
    );
  }

  logout(): void {
    // ลบ token
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);

    // Redirect ไปหน้า แรก
    this.router.navigate(['']);
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser) {
      // ถ้าไม่ใช่เบราว์เซอร์ (เช่นบนเซิร์ฟเวอร์) คืนค่า false หรือจัดการอื่น ๆ
      return false;
    }
    // ตรวจว่ามี token อยู่จริงหรือไม่ (อาจ decode ตรวจ exp เพิ่มได้)
    return !!localStorage.getItem(this.tokenKey);
  }

  getUserRole(): Role | null {
    if (!this.isBrowser) {
      // กรณีรันบน SSR/Node ให้ถือว่าไม่ logged in
      return null;
    }
    return (localStorage.getItem(this.roleKey) as Role) || null;
  }

  getToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    return localStorage.getItem(this.tokenKey);
  }
}