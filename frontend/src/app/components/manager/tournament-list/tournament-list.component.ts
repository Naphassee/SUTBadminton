import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TournamentService, Tournament } from '../../../core/services/tournament.service';
import { AppConfig } from '../../../app.config';
import { FormsModule } from '@angular/forms';
import { PlayerListService } from '../../../core/services/manager/player-list/player-list.service';
import { ManageMana } from '../../../core/models/ManageMana.model';
import { RegistrationService } from '../../../core/services/registration.service';
import { AuthService } from '../../../core/services/auth.service';

declare var bootstrap: any;

@Component({
  selector: 'app-tournament-list',
  standalone: true,
  imports: [ CommonModule, RouterModule, FormsModule],
  templateUrl: './tournament-list.component.html',
  styleUrl: './tournament-list.component.css'
})
export class TournamentListComponent implements OnInit {
  tournaments: Tournament[] = [];
  selectedTournament: any = null;
  

  // ข้อมูลนักกีฬา
  availablePlayers: ManageMana[] = [];
  selectedPlayers: (ManageMana | null)[] = [];
   
  // ข้อความแจ้งเตือน
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading: boolean = false;

  managerId: string = '';

  constructor(
    private tournamentService: TournamentService,
    private playerService: PlayerListService,
    private regisService: RegistrationService,
    public authSvc: AuthService
  ) { }

  ngOnInit() {
    this.loadTournaments();
    this.loadAllPlayers(); // โหลดข้อมูลนักกีฬาเมื่อเริ่มต้น
    const user = this.authSvc.getUser(); // ใช้ของ IQ ที่มีอยู่
    this.managerId = this.authSvc.getUserId() || ''; //รับ token มาอ่านเพื่อเอาไอดี
  }

  loadTournaments() {
    this.tournamentService.getAvailable().subscribe({
      next: (tournaments) => {
        this.tournaments = tournaments;
      },
      error: (err) => {
        this.handleError(err, 'ไม่สามารถโหลดข้อมูลการแข่งขันได้');
      }
    });
  }

  loadAllPlayers() {
    this.isLoading = true;
    this.playerService.getMyPlayer().subscribe({
      next: (players) => {
        this.availablePlayers = players;
        this.isLoading = false;
      },
      error: (err) => {
        this.handleError(err, 'ไม่สามารถโหลดข้อมูลนักกีฬาได้');
        this.availablePlayers = [];
        this.isLoading = false;
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

  prepareRegisterForm() {
    this.clearMessages();
    
    if (this.availablePlayers.length === 0) {
      this.errorMessage = 'ไม่มีข้อมูลนักกีฬาในระบบ กรุณาเพิ่มนักกีฬาก่อนสมัครการแข่งขัน';
      return;
    }
    
    // เริ่มต้นด้วย dropdown เดียว
    this.selectedPlayers = [null];
  }

  addPlayer() {
    if (this.selectedPlayers.length >= this.availablePlayers.length) {
      this.errorMessage = 'ไม่สามารถเพิ่มนักกีฬาได้อีก เนื่องจากได้เลือกนักกีฬาครบทุกคนแล้ว';
      return;
    }
    this.selectedPlayers.push(null);
    this.clearMessages();
  }

  removePlayer(index: number) {
    if (this.selectedPlayers.length > 1) {
      this.selectedPlayers.splice(index, 1);
      this.clearMessages();
    }
  }

  // ตรวจสอบว่านักกีฬาถูกเลือกซ้ำหรือไม่
  isPlayerSelected(player: ManageMana, currentIndex: number): boolean {
    return this.selectedPlayers.some((selected, index) => 
      index !== currentIndex && selected?._id === player._id
    );
  }

  // กรองนักกีฬาที่ยังไม่ถูกเลือก
  getAvailablePlayersForDropdown(currentIndex: number): ManageMana[] {
    return this.availablePlayers.filter(player => 
      !this.isPlayerSelected(player, currentIndex)
    );
  }

  submitRegistration() {
  const manageManaId = this.selectedPlayers
    .filter(p => p?._id)
    .map(p => p!._id as string);

  const data = {
    tournamentId: this.selectedTournament._id,
    managerId: this.managerId,
    manageManaId
  };

  this.regisService.registerTeam(data).subscribe({
    next: (res) => {
      alert('สมัครสำเร็จ');
      // ปิด modal, รีเซ็ต selectedPlayers
    },
    error: (err) => {
      console.error(err);
      alert(err.error?.message || 'เกิดข้อผิดพลาด');
    }
  });
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

  // ฟังก์ชันช่วยในการแสดงชื่อเต็มของนักกีฬา
  getPlayerFullName(player: ManageMana): string {
    return `${player.firstName} ${player.lastName} (${player.role === 'มือสมัครเล่น' ? 'มือสมัครเล่น' : 'มืออาชีพ'})`;
  }

  // ฟังก์ชันสำหรับรีเซ็ตฟอร์มสมัคร
  resetRegistrationForm(): void {
    this.selectedPlayers = [];
    this.clearMessages();
  }

  getSelectedPlayerCountLabel(): string {
    const selected = this.selectedPlayers.filter(p => p !== null).length;
    const total = this.availablePlayers.length;
    return `เลือกแล้ว: ${selected} / ${total} คน`;
  }

  hasSelectedPlayers(): boolean {
    return this.selectedPlayers.some(p => p !== null);
  }
  
  getSelectedPlayerCount(): number {
    return this.selectedPlayers.filter(p => p !== null).length;
  }
  
  
  
}