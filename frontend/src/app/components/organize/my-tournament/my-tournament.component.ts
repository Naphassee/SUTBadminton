import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TournamentService, Tournament } from '../../../core/services/tournament.service';
import { DetailModalComponent } from '../detail-modal/detail-modal.component';
import { AppConfig } from '../../../app.config';

@Component({
  selector: 'app-my-tournament',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DetailModalComponent
  ],
  templateUrl: './my-tournament.component.html',
  styleUrl: './my-tournament.component.css'
})
export class MyTournamentComponent implements OnInit {
  tournaments: Tournament[] = [];
  filteredTournaments: Tournament[] = [];
  selectedTab: 'ฉบับร่าง' | 'เปิดรับ' = 'ฉบับร่าง';
  selectedTournament?: Tournament;
  constructor(private tournamentService: TournamentService) {}

  ngOnInit() { 
    this.tournamentService.getMy().subscribe(t => this.tournaments = t);
    this.fetchTournaments();
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

  onViewDetail(t: Tournament) {
    this.selectedTournament = t;
  }

  onCloseModal() {
    this.selectedTournament = undefined;
  }

  fetchTournaments() {
  this.tournamentService.getMy().subscribe((data) => {
    this.tournaments = data;
    this.filterTournaments(); // ต้องเรียกตรงนี้หลังจาก data พร้อมแล้ว
  });
}

  onTabChange(tab: 'ฉบับร่าง' | 'เปิดรับ') {
    this.selectedTab = tab;
    this.filterTournaments();
  }

  filterTournaments() {
    this.filteredTournaments = this.tournaments.filter(t => t.status === this.selectedTab);
  }

  updateStatus(tourId: string, status: string) {
    this.tournamentService.updateStatus(tourId, status).subscribe({
      next: res => {
        alert('อัปเดตสถานะสำเร็จ');
        this.fetchTournaments(); // รีโหลดรายการใหม่
      },
      error: err => {
        console.error(err);
        alert('ไม่สามารถอัปเดตสถานะได้');
      }
    });
  }
  
}