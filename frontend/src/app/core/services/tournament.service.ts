// src/app/services/tournament.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app.config';

// ชนิดของทัวร์นาเมนต์
export interface Tournament {
  _id?:               string;
 
  // ชื่อไฟล์รูปโปรโมต
  promoteImage:       string;

  // ข้อมูลทัวร์นาเมนต์
  tourName:           string;
  tourTagline:        string;
  deadlineOfRegister: string;
  startTour:          string;
  endTour:            string;

  locationName:       string;
  province:           string;
  district:           string;
  subDistrict:        string;
  detailLocation:     string;

  level:              string;
  gender:             string;
  participants:       number;
  registFee:          number;
  rule:               string;

  status:             string;

  createdAt?:         string;
}

@Injectable({ providedIn: 'root' })
export class TournamentService {
  private baseUrl = `${AppConfig.apiUrl}/tournaments`;

  constructor(
    private http: HttpClient
  ) {}

  getAll(): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(this.baseUrl);
  }

  getById(id: string): Observable<Tournament> {
    return this.http.get<Tournament>(`${this.baseUrl}/${id}`)
  }

  getMy(): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(`${this.baseUrl}/my`);
  }
  
  create(data: FormData): Observable<Tournament> {
    return this.http.post<Tournament>(this.baseUrl, data); 
  }

  update(id: string, formData: FormData): Observable<Tournament> {
    return this.http.put<Tournament>(`${this.baseUrl}/${id}`, formData);
  }
  
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
