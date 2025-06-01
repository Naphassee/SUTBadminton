import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TournamentService, Tournament } from '../../../core/services/tournament.service';
import { AppConfig } from '../../../app.config';
import { FormsModule } from '@angular/forms';
import { PlayerListService } from '../../../core/services/manager/player-list/player-list.service';
import { Manager } from '../../../core/models/manager.model';

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
  availablePlayers: Manager[] = [];
  selectedPlayers: (Manager | null)[] = [];
  
  // ข้อความแจ้งเตือน
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading: boolean = false;

  constructor(
    private tournamentService: TournamentService,
    private playerService: PlayerListService
  ) { }

  ngOnInit() {
    this.loadTournaments();
    this.loadAllPlayers(); // โหลดข้อมูลนักกีฬาเมื่อเริ่มต้น
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

  loadAllPlayers() {
    this.isLoading = true;
    this.playerService.getManagers().subscribe({
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
    return `${AppConfig.apiUrl.replace('/api', '')}/uploads/${file}`;
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
  isPlayerSelected(player: Manager, currentIndex: number): boolean {
    return this.selectedPlayers.some((selected, index) => 
      index !== currentIndex && selected?._id === player._id
    );
  }

  // กรองนักกีฬาที่ยังไม่ถูกเลือก
  getAvailablePlayersForDropdown(currentIndex: number): Manager[] {
    return this.availablePlayers.filter(player => 
      !this.isPlayerSelected(player, currentIndex)
    );
  }

  submitRegistration() {
    this.clearMessages();
    
    // กรองเอาเฉพาะนักกีฬาที่ถูกเลือกแล้ว
    const validSelectedPlayers = this.selectedPlayers.filter(player => player !== null) as Manager[];
    
    if (validSelectedPlayers.length === 0) {
      this.errorMessage = 'กรุณาเลือกนักกีฬาอย่างน้อย 1 คน';
      return;
    }

    // ตรวจสอบการเลือกซ้ำ
    const playerIds = validSelectedPlayers.map(p => p._id);
    const uniqueIds = [...new Set(playerIds)];
    
    if (playerIds.length !== uniqueIds.length) {
      this.errorMessage = 'พบการเลือกนักกีฬาซ้ำ กรุณาตรวจสอบอีกครั้ง';
      return;
    }

    // แสดงข้อมูลการสมัคร (ในอนาคตจะส่งไป backend)
    console.log('Tournament:', this.selectedTournament);
    console.log('Selected Players:', validSelectedPlayers);
    
    this.successMessage = `สมัครการแข่งขัน "${this.selectedTournament.tourName}" สำเร็จ! นักกีฬา ${validSelectedPlayers.length} คน`;
    
    // ปิด modal หลังจากสมัครสำเร็จ
    setTimeout(() => {
      const modalElement = document.getElementById('registerModal');
      if (modalElement) {
        const bsModal = bootstrap.Modal.getInstance(modalElement);
        bsModal?.hide();
      }
      this.selectedPlayers = [];
    }, 1500);

    // TODO: ส่งข้อมูลไป backend service
    // this.tournamentService.registerPlayers(this.selectedTournament._id, validSelectedPlayers)
    //   .subscribe({
    //     next: (response) => {
    //       this.successMessage = 'สมัครการแข่งขันสำเร็จ!';
    //     },
    //     error: (err) => {
    //       this.handleError(err, 'ไม่สามารถสมัครการแข่งขันได้');
    //     }
    //   });
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
  getPlayerFullName(player: Manager): string {
    return `${player.firstName} ${player.lastName} (${player.role === 'Amateur' ? 'มือสมัครเล่น' : 'มืออาชีพ'})`;
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