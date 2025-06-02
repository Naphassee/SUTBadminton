// src/app/services/tournament.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app.config';

// export interface TournamentType {
//   typename:           string;
//   participants:       number;
//   registFee:          number;
//   rule:               string;
// }

// ชนิดของทัวร์นาเมนต์
export interface Tournament {
  _id?:               string;

  // ชื่อไฟล์รูปโปรโมต
  promoteImage:       string;

  // ข้อมูลทัวร์นาเมนต์
  tourName:           string;
  tourTagline:        string;
  deadlineOfRegister: string;   // หรือ Date ถ้าคุณแปลงเป็นวันที่
  startTour:          string;   // หรือ Date
  endTour:            string;   // หรือ Date

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

  // // ประเภทการแข่งขัน
  // types:              TournamentType[];

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

  getMy(): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(`${this.baseUrl}/my`);
  }
  
  create(data: FormData): Observable<Tournament> {
    return this.http.post<Tournament>(this.baseUrl, data);
  }

  update(id: string, t: Partial<Tournament>): Observable<Tournament> {
    return this.http.put<Tournament>(`${this.baseUrl}/${id}`, t);
  }
  
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
