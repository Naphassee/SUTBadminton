import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app.config';

export interface Registration {
  _id: string;
  tournamentId: {
    _id:        string;
    tourName:   string;
    province:   string;
    level:      string;
    gender:     string;
    organizerId: {
      _id:    string;
      qrCode: string;
    };
  };
  managerId:   string;
  playerCnt:   number;
  totalFee:    number;
  slipImage:   string;
  status:      string;
  players:     any[];
}

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private baseUrl = `${AppConfig.apiUrl}/registration`;

  constructor(private http: HttpClient) {}

  registerTeam(data: {tournamentId: string, managerId: string, manageManaId: string[] }): Observable<Registration> {
    return this.http.post<Registration>(`${this.baseUrl}/registerTeam`, data);
  }

  // ดึงรายการ registrations ทั้งหมดของ manager คนนี้
  getRegByManager(managerId: string): Observable<{ registrations: any[] }> {
    return this.http.get<{ registrations: any[] }>(
      `${this.baseUrl}/byManager/${managerId}`
    );
  }

  // อัปโหลดสลิป (multipart/form-data)
  uploadSlip(registrationId: string, slipFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('registrationId', registrationId);
    formData.append('slipImage', slipFile);
    return this.http.post(`${this.baseUrl}/uploadSlip`, formData);
  }

}
