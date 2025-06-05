import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TournamentService, Tournament } from '../../../core/services/tournament.service';
import { DetailModalComponent } from '../detail-modal/detail-modal.component';
import { AppConfig } from '../../../app.config';

@Component({
  selector: 'app-all-tournament',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DetailModalComponent
  ],
  templateUrl: './all-tournament.component.html',
  styleUrl: './all-tournament.component.css'
})
export class AllTournamentComponent implements OnInit {
  tournaments: Tournament[] = [];
  selectedTournament?: Tournament;
  constructor(private tournamentService: TournamentService) {}

  ngOnInit() { 
    this.tournamentService.getAvailable().subscribe(t => this.tournaments = t);
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
}
