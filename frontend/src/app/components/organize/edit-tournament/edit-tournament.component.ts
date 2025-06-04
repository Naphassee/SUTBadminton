import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tournament, TournamentService } from '../../../core/services/tournament.service';
import { noPastDateValidator, afterDeadlineValidator, minHoursAfterStartValidator } from '../../../validators/tournament-validators';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from '../../../app.config';

@Component({
  selector: 'app-edit-tournament',
  standalone: true,
  imports: [ RouterModule,
             CommonModule,
             ReactiveFormsModule,],
  templateUrl: './edit-tournament.component.html',
  styleUrl: './edit-tournament.component.css'
})
export class EditTournamentComponent implements OnInit {
  tournamentId!: string;
  editForm!: FormGroup;
  existingTour?: Tournament;
  promoteSrc = '';
  promoteImageFile?: File;
  serverErrors: { param: string, msg: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private tourSvc: TournamentService,
    private route: ActivatedRoute,
    private router: Router
  ){}

  ngOnInit(): void {
    this.tournamentId = this.route.snapshot.paramMap.get('id') || '';

    // สร้าง form controls
    this.editForm = this.fb.group({
      tourName:           ['', Validators.required],
      tourTagline:        ['', Validators.required],
      
      deadlineOfRegister: ['', [Validators.required, noPastDateValidator()]],
      startTour:          ['', [Validators.required, afterDeadlineValidator()]],
      endTour:            ['', [Validators.required, minHoursAfterStartValidator(2)]],
      
      locationName:       ['', Validators.required],
      province:           ['', Validators.required],
      district:           ['', Validators.required],
      subDistrict:        ['', Validators.required],
      detailLocation:     ['', Validators.required],
      
      level:              ['', Validators.required],
      gender:             ['', Validators.required],
      participants:       ['', [Validators.required, Validators.min(16)]],
      registFee:          ['', [Validators.required, Validators.min(0)]],
      rule:               ['', Validators.required],

      status:[{ value: 'ฉบับร่าง', disabled: true }]
    });

    this.tourSvc.getById(this.tournamentId).subscribe({
    next: (tour: Tournament) => {
      console.log('API returned tournament:', tour);
      this.existingTour = tour;

      // แปลง ISO string → YYYY-MM-DD (หรือ YYYY-MM-DDTHH:mm ถ้าใช้ datetime-local)
      this.editForm.patchValue({
        tourName:           tour.tourName,
        tourTagline:        tour.tourTagline,
        deadlineOfRegister: this.formatYYYYMMDD(tour.deadlineOfRegister),
        startTour:          this.formatToDateTimeLocal(tour.startTour),
        endTour:            this.formatToDateTimeLocal(tour.endTour),
        locationName:       tour.locationName,
        province:           tour.province,
        district:           tour.district,
        subDistrict:        tour.subDistrict,
        detailLocation:     tour.detailLocation,
        level:              tour.level,
        gender:             tour.gender,
        participants:       tour.participants,
        registFee:          tour.registFee,
        rule:               tour.rule
      });

        this.promoteSrc = `${AppConfig.uploadUrl}${tour.promoteImage}`;
      },
      error: err => console.error('ไม่สามารถดึงโปรไฟล์ได้', err)
    })
  }

  // Getter สะดวกใช้ใน template
  get f() {
    return this.editForm.controls;
  }

  // แปลง ISO string (เช่น "2025-06-10T00:00:00.000Z") → "YYYY-MM-DD"
  private formatYYYYMMDD(isoString: string): string {
    if (!isoString) return '';
    return isoString.slice(0, 10);
  }

  // แปลง ISO string → "YYYY-MM-DDTHH:mm"
  private formatToDateTimeLocal(isoString: string): string {
    if (!isoString) return '';
    const d = new Date(isoString);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year  = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day   = pad(d.getDate());
    const hour  = pad(d.getHours());
    const mins  = pad(d.getMinutes());
    return `${year}-${month}-${day}T${hour}:${mins}`;
  }

  // ฟังก์ชันอ่านไฟล์ภาพใหม่ เมื่อ user เลือก (เช่น replace promoteImage)
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.promoteImageFile = file;
      this.promoteSrc = URL.createObjectURL(file); // แสดง preview ทันที
    }
  }

  // เมื่อกด submit ให้เตรียม FormData แล้วส่งไปอัปเดต
  onSubmit() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('tourName', this.editForm.value.tourName);
    formData.append('tourTagline', this.editForm.value.tourTagline);
    formData.append('deadlineOfRegister', this.editForm.value.deadlineOfRegister);
    formData.append('startTour', this.editForm.value.startTour);
    formData.append('endTour', this.editForm.value.endTour);
    formData.append('locationName', this.editForm.value.locationName);
    formData.append('province', this.editForm.value.province);
    formData.append('district', this.editForm.value.district);
    formData.append('subDistrict', this.editForm.value.subDistrict);
    formData.append('detailLocation', this.editForm.value.detailLocation);
    formData.append('level', this.editForm.value.level);
    formData.append('gender', this.editForm.value.gender);
    formData.append('participants', this.editForm.value.participants.toString());
    formData.append('registFee', this.editForm.value.registFee.toString());
    formData.append('rule', this.editForm.value.rule);
    formData.append('status', this.editForm.get('status')?.value);

    // ถ้ามีภาพใหม่ให้ append ด้วย
    if (this.promoteImageFile) {
      formData.append('promoteImage', this.promoteImageFile);
    }

    this.tourSvc.update(this.tournamentId, formData).subscribe({
      next: updatedTour => {
        // หลังอัปเดตเสร็จ redirect หรือแสดงข้อความ
        this.router.navigate(['/organize','my-tournament']);
      },
      error: err => {
        console.error('อัปเดตทัวร์นาเมนต์ล้มเหลว', err);
        // เก็บ error มาแสดงใน serverErrors (ถ้ามี logic นั้น)
      }
    });
  }
}
 