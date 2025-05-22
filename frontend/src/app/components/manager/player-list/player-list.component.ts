import { Component, OnInit, ViewChild } from '@angular/core'; // เพิ่ม ViewChild
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms'; // << เพิ่ม FormsModule และ NgForm
import { NavComponent } from '../nav/nav.component';
import { PlayerListService } from '../../../services/manager/player-list/player-list.service';
import { Manager } from '../../../models/manager.model';
// อาจจะต้อง import Bootstrap Instance สำหรับการควบคุม Modal ด้วย JavaScript
// import { Modal } from 'bootstrap'; // ถ้าต้องการควบคุม modal ด้วย TS

declare var bootstrap: any;

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NavComponent], // << เพิ่ม FormsModule
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css'],
})
export class PlayerListComponent implements OnInit {
  @ViewChild('playerForm') playerForm!: NgForm; // อ้างอิงฟอร์ม

  amateurManagers: Manager[] = [];
  professionalManagers: Manager[] = [];
  errorMessage: string | null = null;

  // newPlayerData สำหรับผูกกับฟอร์มเพิ่มนักกีฬา
  newPlayerData: Manager = {
    firstName: '',
    lastName: '',
    gender: '', // หรือค่าเริ่มต้นที่ต้องการ
    age: '', // หรือค่าเริ่มต้นที่ต้องการ
    role: 'Amateur', // ค่าเริ่มต้น
  };

  // private addPlayerModalInstance: Modal | undefined; // สำหรับควบคุม modal ด้วย TS

  constructor(private managerService: PlayerListService) {}

  ngOnInit(): void {
    this.loadManagers();
    // ถ้าต้องการควบคุม modal ด้วย TS
    // const modalElement = document.getElementById('addPlayerModal');
    // if (modalElement) {
    //   this.addPlayerModalInstance = new Modal(modalElement);
    // }
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
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage =
          typeof err === 'string'
            ? err
            : err.message || 'Failed to load managers.';
        console.error(err);
        this.amateurManagers = [];
        this.professionalManagers = [];
      },
    });
  }

  prepareNewPlayerData(role: 'Amateur' | 'Professional'): void {
    // รีเซ็ตฟอร์มก่อน (ถ้ามีข้อมูลเก่าค้างอยู่)
    if (this.playerForm) {
      this.playerForm.resetForm();
    }
    // ตั้งค่า role เริ่มต้นสำหรับ newPlayerData
    this.newPlayerData = {
      firstName: '',
      lastName: '',
      gender: '',
      age: '',
      role: role, // กำหนด role ตามปุ่มที่กด
    };
    // ไม่จำเป็นต้องเปิด modal ด้วย TS ถ้า data-bs-toggle/target ทำงานถูกต้อง
    // this.addPlayerModalInstance?.show();
  }

  onSaveNewPlayer(form: NgForm): void {
    if (form.invalid) {
      // ทำเครื่องหมายว่าฟิลด์ถูก touched ทั้งหมดเพื่อแสดง validation errors
      Object.values(form.controls).forEach((control) => {
        control.markAsTouched();
      });
      this.errorMessage = 'กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง';
      return;
    }

    console.log('Saving new player:', this.newPlayerData);
    this.managerService.createManager(this.newPlayerData).subscribe({
      next: (createdManager) => {
        console.log('Player created successfully:', createdManager);
        this.loadManagers(); // โหลดข้อมูลใหม่หลังจากการสร้างสำเร็จ
        this.errorMessage = null;
        // ปิด modal (ถ้า Bootstrap ไม่ปิดให้เอง หรือถ้าควบคุมด้วย TS)
        // this.addPlayerModalInstance?.hide();
        // ใช้ jQuery หรือ DOM manipulation ถ้าจำเป็นต้องปิด modal ที่เปิดด้วย data-bs-toggle
        const modalElement = document.getElementById('addPlayerModal');
        if (modalElement) {
          const bsModal = bootstrap.Modal.getInstance(modalElement);
          bsModal?.hide();
        }
        form.resetForm(); // รีเซ็ตฟอร์มหลังจากบันทึกสำเร็จ
      },
      error: (err) => {
        this.errorMessage =
          typeof err === 'string'
            ? err
            : err.message || 'Failed to create player.';
        console.error('Error creating player:', err);
      },
    });
  }

  // TODO: Implement confirmDelete, openInfoModal, openEditModal
  confirmDelete(managerId: string): void {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบนักกีฬานี้?')) {
      this.managerService.deleteManager(managerId).subscribe({
        next: () => {
          console.log('Manager deleted successfully', managerId);
          this.loadManagers(); // โหลดข้อมูลใหม่
        },
        error: (err) => {
          this.errorMessage =
            typeof err === 'string'
              ? err
              : err.message || 'Failed to delete manager.';
          console.error('Error deleting manager:', err);
        },
      });
    }
  }
}
