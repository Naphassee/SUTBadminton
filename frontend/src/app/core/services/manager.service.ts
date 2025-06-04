import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app.config';

export interface Manager {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password?: string;
}

@Injectable({ providedIn: 'root' })
export class ManagerService {
  private authBase = `${AppConfig.apiUrl}/auth/managers`;
  private managerBase = `${AppConfig.apiUrl}/manager`; // ✅ เพิ่มบรรทัดนี้

  constructor(private http: HttpClient) {}

  getProfile(): Observable<Manager> {
    return this.http.get<Manager>(`${this.authBase}/me`);
  }

  updateProfile(id: string, data: Partial<Manager>): Observable<Manager> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );
    return this.http.put<Manager>(`${this.managerBase}/${id}`, data, { headers });
  }
}
