import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { NavComponent } from '../nav/nav.component';
import { PlayerListService } from '../../../services/manager/player-list/player-list.service';
import { Manager } from '../../../models/manager.model';

declare var bootstrap: any; // สำหรับการควบคุม Bootstrap Modal ด้วย TS

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NavComponent],
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css'],
})
export class PlayerListComponent implements OnInit {
  @ViewChild('playerForm') playerForm!: NgForm;
  @ViewChild('editPlayerForm') editPlayerForm!: NgForm; // สำหรับฟอร์มแก้ไข

  amateurManagers: Manager[] = [];
  professionalManagers: Manager[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null; // สำหรับแสดงข้อความสำเร็จ

  newPlayerData: Manager = {
    firstName: '',
    lastName: '',
    gender: '',
    age: '',
    role: 'Amateur',
  };

  editingPlayerData: Manager | null = null; // สำหรับเก็บข้อมูลนักกีฬาที่กำลังแก้ไข
  viewingPlayerData: Manager | null = null; // สำหรับเก็บข้อมูลนักกีฬาที่กำลังดู

  constructor(private managerService: PlayerListService) {}

  ngOnInit(): void {
    this.loadManagers();
  }

  loadManagers(): void {
    this.managerService.getManagers().subscribe({
      next: (managers) => {
        this.amateurManagers = managers.filter(
          (manager) => manager.role === 'Amateur'
        );
        this.professionalManagers = managers.filter(
          (manager) => manager.role === 'Professional'
        );
        // this.errorMessage = null; // ล้าง error message เมื่อโหลดข้อมูลสำเร็จ
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
    this.successMessage = null; // ล้าง success message เมื่อเกิด error
    this.errorMessage =
      typeof err.message === 'string'
        ? err.message
        : err.error?.message || defaultMessage;
    console.error(err);
  }

  prepareNewPlayerData(role: 'Amateur' | 'Professional'): void {
    this.clearMessages();
    if (this.playerForm) {
      this.playerForm.resetForm({ role: role }); // รีเซ็ตฟอร์มและตั้งค่า role เริ่มต้น
    }
    this.newPlayerData = {
      _id: undefined, // ล้าง ID ถ้ามี
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
      Object.values(form.controls).forEach((control) => {
        control.markAsTouched();
      });
      this.errorMessage = 'กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง';
      return;
    }

    this.managerService.createManager(this.newPlayerData).subscribe({
      next: (createdManager) => {
        this.successMessage = `นักกีฬา "${createdManager.firstName}" ถูกสร้างเรียบร้อยแล้ว`;
        this.loadManagers();
        const modalElement = document.getElementById('addPlayerModal');
        if (modalElement) {
          const bsModal = bootstrap.Modal.getInstance(modalElement);
          bsModal?.hide();
        }
        form.resetForm();
      },
      error: (err) => {
        this.handleError(err, 'Failed to create player.');
      },
    });
  }

  openInfoModal(managerId: string): void {
    this.clearMessages();
    if (!managerId) return;
    this.managerService.getManagerById(managerId).subscribe({
      next: (manager) => {
        this.viewingPlayerData = manager;
        const modalElement = document.getElementById('infoPlayerModal');
        if (modalElement) {
          const bsModal = new bootstrap.Modal(modalElement);
          bsModal.show();
        }
      },
      error: (err) => {
        this.handleError(err, 'Failed to load player details.');
      },
    });
  }

  openEditModal(managerId: string): void {
    this.clearMessages();
    if (!managerId) return;
    this.managerService.getManagerById(managerId).subscribe({
      next: (manager) => {
        // สร้าง object ใหม่เพื่อป้องกันการแก้ไขข้อมูลในตารางโดยตรงผ่าน two-way binding ก่อนกด save
        this.editingPlayerData = { ...manager };
        const modalElement = document.getElementById('editPlayerModal');
        if (modalElement) {
          const bsModal = new bootstrap.Modal(modalElement);
          bsModal.show();
        }
      },
      error: (err) => {
        this.handleError(err, 'Failed to load player details for editing.');
      },
    });
  }

  onUpdatePlayer(form: NgForm): void {
    this.clearMessages();
    if (!this.editingPlayerData || !this.editingPlayerData._id) {
      this.errorMessage = 'ไม่มีข้อมูลนักกีฬาสำหรับอัปเดต';
      return;
    }
    if (form.invalid) {
      Object.values(form.controls).forEach((control) => {
        control.markAsTouched();
      });
      this.errorMessage = 'กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง';
      return;
    }

    this.managerService
      .updateManager(this.editingPlayerData._id, this.editingPlayerData)
      .subscribe({
        next: (updatedManager) => {
          this.successMessage = `ข้อมูลนักกีฬา "${updatedManager.firstName}" ถูกอัปเดตเรียบร้อยแล้ว`;
          this.loadManagers();
          const modalElement = document.getElementById('editPlayerModal');
          if (modalElement) {
            const bsModal = bootstrap.Modal.getInstance(modalElement);
            bsModal?.hide();
          }
          this.editingPlayerData = null; // ล้างข้อมูลที่กำลังแก้ไข
        },
        error: (err) => {
          this.handleError(err, 'Failed to update player.');
        },
      });
  }

  confirmDelete(managerId: string | undefined): void {
    this.clearMessages();
    if (!managerId) {
      this.errorMessage = 'ไม่พบ ID นักกีฬาสำหรับลบ';
      return;
    }
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบนักกีฬานี้?')) {
      this.managerService.deleteManager(managerId).subscribe({
        next: (response) => {
          // response จาก deleteManager คือ { message: string; deleted?: Manager }
          this.successMessage = response.message || 'นักกีฬาถูกลบเรียบร้อยแล้ว';
          this.loadManagers();
        },
        error: (err) => {
          this.handleError(err, 'Failed to delete manager.');
        },
      });
    }
  }
}
