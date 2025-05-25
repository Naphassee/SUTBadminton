import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { DatePipe } from '@angular/common';
import { TournamentService, Tournament } from '../../../core/services/tournament.service';
import { AppConfig } from '../../../app.config';

@Component({
  selector: 'app-my-tournament',
  standalone: true,
  imports: [
    CommonModule,       // สำหรับ *ngIf, *ngFor
    RouterModule       // ถ้าใช้ <a routerLink="...">
  ],
  templateUrl: './my-tournament.component.html',
  styleUrl: './my-tournament.component.css'
})
export class MyTournamentComponent implements OnInit {
  tournaments: Tournament[] = [];
  constructor(private svc: TournamentService) {}

  ngOnInit() {
    this.svc.getAll().subscribe(t => this.tournaments = t);
  }

  getBannerUrl(file: string) {
    // สมมติ backend เซิร์ฟรูปไว้ที่ http://localhost:5000/uploads/…
    return `${AppConfig.apiUrl.replace('/api','')}/uploads/${file}`;
  }
}