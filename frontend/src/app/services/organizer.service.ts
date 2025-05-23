// src/app/services/organizer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router }     from '@angular/router';
import { Observable } from 'rxjs';
import { AppConfig } from '../app.config';

export interface LoginResponse {
  token: string;
}

export interface Organizer {
    _id?: String;

    // ข้อมูลผู้จัด
    firstName:      string;
    lastName:       string;
    userName:       string;
    password:       string;
    email:          string;
    phoneNumber:    string;
    profileImage:   string;
    qrCode:         string;
}
@Injectable({ providedIn: 'root' })
export class OrganizerService {
    private baseUrl = `${AppConfig.apiUrl}/organizers`;
    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

    register(data: FormData): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/register`, data);
    }

    login(credentials: { userName: string; password: string; }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials);
    }

    getProfile(): Observable<Organizer> {
    return this.http.get<Organizer>(`${this.baseUrl}/me`);
    }

    logout(): void {
    // ลบ token
    localStorage.removeItem('token');
    // (ถ้ามี) ลบข้อมูลอื่นๆ ที่เก็บไว้
    // localStorage.removeItem('currentUser');
    // Redirect ไปหน้า แรก
    this.router.navigate(['']);
  }
}