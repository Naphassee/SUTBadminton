import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app.config';

export interface Registration {
  _id: string;
  playerCnt: number;
  totalFee: number;
  slipImage: string;
  status: string;
  createdAt?: string;
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
}
