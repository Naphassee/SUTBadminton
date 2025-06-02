import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  constructor(private tournamentService: TournamentService) {}

  ngOnInit() { 
    this.tournamentService.getMy().subscribe(t => this.tournaments = t);
  }

  onDelete(id: string): void {
      if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')) {
        this.tournamentService.delete(id).subscribe(() => {
          // กรองเฉพาะรายการที่ไม่ตรงกับ id ที่ลบ
          this.tournaments = this.tournaments.filter(t => t._id !== id);
        }, err => {
          console.error(err);
          alert('ลบไม่สำเร็จ กรุณาลองใหม่');
        });
      }
    }

  getBannerUrl(file: string) {
    // สมมติ backend เซิร์ฟรูปไว้ที่ http://localhost:5000/uploads/… 
    return `${AppConfig.uploadUrl}${file}`;
  }
}