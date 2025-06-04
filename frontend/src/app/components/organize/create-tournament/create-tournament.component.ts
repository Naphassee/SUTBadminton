import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TournamentService } from '../../../core/services/tournament.service';
import { noPastDateValidator, afterDeadlineValidator, minHoursAfterStartValidator } from '../../../validators/tournament-validators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-tournament',
  standalone: true,
  imports: [ 
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
  ],
  templateUrl: './create-tournament.component.html',
  styleUrls: ['./create-tournament.component.css']
})
export class CreateTournamentComponent implements OnInit {
  tournamentForm!: FormGroup;
  imageSrc: string | ArrayBuffer | null = null;
  serverErrors: { param: string, msg: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private tourSvc: TournamentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tournamentForm = this.fb.group({
      promoteImage:       [null],
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

      status:             ['ฉบับร่าง', Validators.required]

      // types:              this.fb.array([])  // จะเก็บกลุ่ม FormGroup ย่อย ๆ (แบบเก่า)
    });
  }

  // Getter สะดวกใช้ใน template
  get f() {
    return this.tournamentForm.controls;
  }

  // // ช่วยให้เข้าถึง FormArray ได้ง่าย (แบบเก่า)
  // get types(): FormArray {
  //   return this.tournamentForm.get('types') as FormArray;
  // }

  // // เพิ่มประเภทการแข่งขัน (แบบเก่า)
  // addType(): void {
  //   this.types.push(this.fb.group({
  //     typename:     ['', Validators.required],
  //     participants: [null, [Validators.required, Validators.min(1)]],
  //     registFee:    [null, [Validators.required, Validators.min(0)]],
  //     rule:         ['', Validators.required]
  //   }));
  // }

  // // ลบประเภทตาม index (แบบเก่า)
  // removeType(i: number): void {
  //   this.types.removeAt(i);
  // }

  // อ่านไฟล์รูปแล้วโชว์ preview
  onFileSelected(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.tournamentForm.patchValue({ promoteImage: file });
    this.tournamentForm.get('promoteImage')!.updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => this.imageSrc = reader.result;
    reader.readAsDataURL(file);
  }

  // ส่งข้อมูลทั้งหมดไป backend
  onSubmit(): void {
    if (this.tournamentForm.invalid) {
      this.tournamentForm.markAllAsTouched();
      return;
    }
    // ถ้าจะอัปโหลดไฟล์ ให้ใช้ FormData
    const data = new FormData();
    const val = this.tournamentForm.value;

    // deadlineOfRegister → 23:59:59.000
    const dl = new Date(val.deadlineOfRegister);
    dl.setHours(23, 59, 59, 0);
    // startTour → ตัดวินาที+มิลลิวินาทีออก
    const st = new Date(val.startTour);
    st.setSeconds(0, 0);
    // endTour → ตัดวินาที+มิลลิวินาทีออก
    const ed = new Date(val.endTour);
    ed.setSeconds(0, 0);

    // append ฟิลด์อื่น ๆ
    data.append('promoteImage',       val.promoteImage);
    data.append('tourName',           val.tourName);
    data.append('tourTagline',        val.tourTagline);
    data.append('deadlineOfRegister', dl.toISOString());
    data.append('startTour',          st.toISOString());
    data.append('endTour',            ed.toISOString());
    data.append('locationName',       val.locationName);
    data.append('province',           val.province);
    data.append('district',           val.district);
    data.append('subDistrict',        val.subDistrict);
    data.append('detailLocation',     val.detailLocation);
    data.append('level',              val.level);
    data.append('gender',             val.gender);
    data.append('participants',       val.participants);
    data.append('registFee',          val.registFee);
    data.append('rule',               val.rule);
    data.append('status',             val.status);

    // // types เก็บเป็น JSON string (แบบเก่า)
    // data.append('types', JSON.stringify(val.types));

    this.tourSvc.create(data).subscribe({
      next: res => {
        // TODO: นำทางกลับไปหน้า list หรือโชว์ข้อความสำเร็จ
        console.log('Created', res);
        // ไปยังหน้า my-tournament
        this.router.navigate(['/organize/my-tournament']);
      },
      error: err => console.error(err)
    });
  }
}
