// src/app/services/organizer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app.config';

export interface Organizer {
    _id:           string;

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
    private authBase = `${AppConfig.apiUrl}/auth/organizers`;
    private orgBase = `${AppConfig.apiUrl}/organizer`;
    constructor(
        private http: HttpClient
    ) {}

    getProfile(): Observable<Organizer> {
    return this.http.get<Organizer>(`${this.authBase}/me`);
    }

    updateProfile( id: string, formData: FormData ): Observable<Organizer> {
        return this.http.put<Organizer>( `${this.orgBase}/${id}`, formData);
    }

}