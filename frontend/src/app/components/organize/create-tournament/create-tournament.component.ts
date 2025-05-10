import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TournamentService } from '../../../services/tournament.service';
import { AppConfig }         from '../../../app.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-tournament',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './create-tournament.component.html',
  styleUrls: ['./create-tournament.component.css']
})
export class CreateTournamentComponent implements OnInit {
  tournamentForm!: FormGroup;
  imageSrc: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private tourSvc: TournamentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tournamentForm = this.fb.group({
      userName:        ['', Validators.required],
      firstName:       ['', Validators.required],
      lastName:        ['', Validators.required],
      phoneNumber:     ['', [Validators.required]],
      email:           ['', [Validators.required, Validators.email]],
      promoteImage:    [null],
      tourName:        ['', Validators.required],
      tourTagline:     ['', Validators.required],
      deadlineOfRegister: ['', Validators.required],
      startTour:       ['', Validators.required],
      endTour:         ['', Validators.required],
      location:        ['', Validators.required],
      types:           this.fb.array([])  // จะเก็บกลุ่ม FormGroup ย่อย ๆ
    });
  }

  // ช่วยให้เข้าถึง FormArray ได้ง่าย
  get types(): FormArray {
    return this.tournamentForm.get('types') as FormArray;
  }

  // เพิ่มประเภทการแข่งขัน
  addType(): void {
    this.types.push(this.fb.group({
      typename:     ['', Validators.required],
      participants: [null, [Validators.required, Validators.min(1)]],
      registFee:    [null, [Validators.required, Validators.min(0)]],
      rule:         ['', Validators.required]
    }));
  }

  // ลบประเภทตาม index
  removeType(i: number): void {
    this.types.removeAt(i);
  }

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
    data.append('promoteImage', val.promoteImage);
    // append ฟิลด์อื่น ๆ
    ['userName','firstName','lastName','phoneNumber','email',
     'tourName','tourTagline','deadlineOfRegister',
     'startTour','endTour','location']
      .forEach(key => data.append(key, val[key]));

    // types เก็บเป็น JSON string
    data.append('types', JSON.stringify(val.types));

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
