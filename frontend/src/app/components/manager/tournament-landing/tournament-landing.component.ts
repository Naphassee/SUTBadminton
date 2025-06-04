import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TournamentService, Tournament } from '../../../core/services/tournament.service';
import { AppConfig } from '../../../app.config';
import { FormsModule } from '@angular/forms';
import { PlayerListService } from '../../../core/services/manager/player-list/player-list.service';
import { ManageMana } from '../../../core/models/ManageMana.model';
import { NavComponent } from '../../home/nav/nav.component';

declare var bootstrap: any;

@Component({
  selector: 'app-tournament-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavComponent],
  templateUrl: './tournament-landing.component.html',
  styleUrls: ['./tournament-landing.component.css'] // แก้ไขชื่อจาก styleUrl เป็น styleUrls
})
export class TournamentLandingComponent implements OnInit {
  tournaments: Tournament[] = [];
  selectedTournament: any = null;

  isLoggedIn = false; // ดึงสถานะจริงจาก service หรือ auth

  availablePlayers: ManageMana[] = [];
  selectedPlayers: (ManageMana | null)[] = [];

  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading: boolean = false;

  constructor(
    private tournamentService: TournamentService,
    private playerService: PlayerListService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTournaments();
  }

  loadTournaments() {
    this.tournamentService.getAll().subscribe({
      next: (tournaments) => {
        this.tournaments = tournaments;
      },
      error: (err) => {
        this.handleError(err, 'ไม่สามารถโหลดข้อมูลการแข่งขันได้');
      }
    });
  }


  getBannerUrl(file: string) {
    return `${AppConfig.uploadUrl}${file}`;
  }

  showDetails(tournament: any): void {
    this.selectedTournament = tournament;
    this.clearMessages();
  }

  // ฟังก์ชันเตรียมฟอร์มสมัคร (ไม่ซ้ำ)
  prepareRegisterForm() {
    this.clearMessages();

    if (this.availablePlayers.length === 0) {
      this.errorMessage = 'ไม่มีข้อมูลนักกีฬาในระบบ กรุณาเพิ่มนักกีฬาก่อนสมัครการแข่งขัน';
      return;
    }

    // เริ่มต้นด้วย dropdown เดียว
    this.selectedPlayers = [null];
  }
  
  private clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
  }

  private handleError(err: any, defaultMessage: string): void {
    this.successMessage = null;
    this.errorMessage = typeof err.message === 'string'
      ? err.message
      : err.error?.message || defaultMessage;
    console.error(err);
  }



  onRegisterClick() {
    if (!this.isLoggedIn) {
      // modal แจ้งเตือนเปิดโดย data-bs-target อัตโนมัติ
    } else {
      this.prepareRegisterForm();
    }
  }

}
