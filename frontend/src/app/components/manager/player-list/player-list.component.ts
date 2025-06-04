import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { PlayerListService } from '../../../core/services/manager/player-list/player-list.service';
import { ManageMana } from '../../../core/models/ManageMana.model';

declare var bootstrap: any;

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css'],
})
export class PlayerListComponent implements OnInit {
  @ViewChild('playerForm') playerForm!: NgForm;
  @ViewChild('editPlayerForm') editPlayerForm!: NgForm;

  amateurManagers: ManageMana[] = [];
  professionalManagers: ManageMana[] = [];

  errorMessage: string | null = null;
  successMessage: string | null = null;

  newPlayerData: ManageMana = {
    firstName: '',
    lastName: '',
    gender: '',
    age: '',
    role: 'มือสมัครเล่น',
  };

  editingPlayerData: ManageMana | null = null;
  viewingPlayerData: ManageMana | null = null;

  deletingPlayerId: string | null = null;
  deletingPlayerName: string = '';

  constructor(private managerService: PlayerListService) {}

  ngOnInit(): void {
    this.loadManagers();
  }

  loadManagers(): void {
    this.managerService.getMyPlayer().subscribe({
      next: (managers) => {
        this.amateurManagers = managers.filter((m) => m.role === 'มือสมัครเล่น');
        this.professionalManagers = managers.filter((m) => m.role === 'มืออาชีพ');
      },
      error: (err) => {
        this.handleError(err, 'Failed to load managers.');
        this.amateurManagers = [];
        this.professionalManagers = [];
      },
    });
  }

  private clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
  }

  private handleError(err: any, defaultMessage: string): void {
    this.successMessage = null;
    this.errorMessage =
      typeof err.message === 'string' ? err.message : err.error?.message || defaultMessage;
    console.error(err);
  }

  prepareNewPlayerData(role: 'มือสมัครเล่น' | 'มืออาชีพ'): void {
    this.clearMessages();
    if (this.playerForm) {
      this.playerForm.resetForm({ role });
    }
    this.newPlayerData = {
      _id: undefined,
      firstName: '',
      lastName: '',
      gender: '',
      age: '',
      role: role,
    };
  }

  onSaveNewPlayer(form: NgForm): void {
    this.clearMessages();
    if (form.invalid) {
      Object.values(form.controls).forEach((control) => control.markAsTouched());
      this.errorMessage = 'กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง';
      return;
    }

    this.managerService.createManager(this.newPlayerData).subscribe({
      next: (createdManager) => {
        this.successMessage = `นักกีฬา "${createdManager.firstName}" ถูกสร้างเรียบร้อยแล้ว`;
        this.loadManagers();
        const modalElement = document.getElementById('addPlayerModal');
        if (modalElement) bootstrap.Modal.getInstance(modalElement)?.hide();
        form.resetForm();
      },
      error: (err) => this.handleError(err, 'Failed to create player.'),
    });
  }

  openInfoModal(managerId: string): void {
    this.clearMessages();
    if (!managerId) return;
    this.managerService.getManagerById(managerId).subscribe({
      next: (manager) => {
        this.viewingPlayerData = manager;
        const modalElement = document.getElementById('infoPlayerModal');
        if (modalElement) new bootstrap.Modal(modalElement).show();
      },
      error: (err) => this.handleError(err, 'Failed to load player details.'),
    });
  }

  openEditModal(managerId: string): void {
    this.clearMessages();
    if (!managerId) return;
    this.managerService.getManagerById(managerId).subscribe({
      next: (manager) => {
        this.editingPlayerData = { ...manager };
        const modalElement = document.getElementById('editPlayerModal');
        if (modalElement) new bootstrap.Modal(modalElement).show();
      },
      error: (err) => this.handleError(err, 'Failed to load player details for editing.'),
    });
  }

  onUpdatePlayer(form: NgForm): void {
    this.clearMessages();
    if (!this.editingPlayerData || !this.editingPlayerData._id) {
      this.errorMessage = 'ไม่มีข้อมูลนักกีฬาสำหรับอัปเดต';
      return;
    }

    if (form.invalid) {
      Object.values(form.controls).forEach((control) => control.markAsTouched());
      this.errorMessage = 'กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง';
      return;
    }

    this.managerService.updateManager(this.editingPlayerData._id, this.editingPlayerData).subscribe({
      next: (updatedManager) => {
        this.successMessage = `ข้อมูลนักกีฬา "${updatedManager.firstName}" ถูกอัปเดตเรียบร้อยแล้ว`;
        this.loadManagers();
        const modalElement = document.getElementById('editPlayerModal');
        if (modalElement) bootstrap.Modal.getInstance(modalElement)?.hide();
        this.editingPlayerData = null;
      },
      error: (err) => this.handleError(err, 'Failed to update player.'),
    });
  }

  confirmDelete(managerId: string | undefined, name: string): void {
    this.clearMessages();
    if (!managerId) {
      this.errorMessage = 'ไม่พบ ID นักกีฬาสำหรับลบ';
      return;
    }

    this.deletingPlayerId = managerId;
    this.deletingPlayerName = name;

    const modalElement = document.getElementById('deletePlayerModal');
    if (modalElement) new bootstrap.Modal(modalElement).show();
  }

  deletePlayer(): void {
    if (!this.deletingPlayerId) return;

    this.managerService.deleteManager(this.deletingPlayerId).subscribe({
      next: (response) => {
  this.successMessage = response.message === 'employee deleted' 
    ? 'นักกีฬาถูกลบเรียบร้อยแล้ว' 
    : response.message || 'นักกีฬาถูกลบเรียบร้อยแล้ว';
  this.loadManagers();
  const modalElement = document.getElementById('deletePlayerModal');
  if (modalElement) bootstrap.Modal.getInstance(modalElement)?.hide();
  this.deletingPlayerId = null;
  this.deletingPlayerName = '';
}
,
      error: (err) => this.handleError(err, 'Failed to delete manager.'),
    });
  }
}
