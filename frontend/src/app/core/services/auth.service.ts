import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router }     from '@angular/router';
import { tap }        from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app.config';

export type Role = 'organizer' | 'manager' | 'admin';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'token';
  private roleKey  = 'userRole';

  // เอา apiUrl จาก AppConfig มาเก็บเป็น baseUrl
  private baseUrl = AppConfig.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
) {}

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
  login(role: Role, creds: { userName: string; password: string; }): Observable<{ token: string }> {
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
    // ตรวจว่ามี token อยู่จริงหรือไม่ (อาจ decode ตรวจ exp เพิ่มได้)
    return !!localStorage.getItem(this.tokenKey);
  }

  getUserRole(): Role | null {
    return (localStorage.getItem(this.roleKey) as Role) || null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}