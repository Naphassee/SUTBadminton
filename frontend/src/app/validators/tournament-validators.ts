// src/app/validators/tournament-validators.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// ห้ามวันก่อนปัจจุบัน
export function noPastDateValidator(): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null => {
    if (!c.value) return null;
    const sel = new Date(c.value);
    sel.setHours(23, 59, 59, 0);
    return sel < new Date() ? { pastDate: true } : null;
  };
}

/** startTour ต้องห่างจาก deadlineOfRegister อย่างน้อย 1 วัน (ไม่สนชั่วโมง) */
export function afterDeadlineValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const dlValue = control.parent?.get('deadlineOfRegister')?.value;
    const stValue = control.value;
    if (!dlValue || !stValue) return null;

    // เอาเฉพาะ Year-Month-Date
    const dl = new Date(dlValue);
    dl.setHours(0,0,0,0);
    const st = new Date(stValue);
    st.setHours(0,0,0,0);

    // ถ้า startDate <= deadlineDate => ผิด
    return st <= dl
      ? { afterDeadline: true }
      : null;
  };
}

// วันสิ้นสุดต้องห่างจาก startTour อย่างน้อย N ชั่วโมง
export function minHoursAfterStartValidator(hours: number): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null => {
    const st = c.parent?.get('startTour')?.value;
    const ed = c.value;
    if (!st || !ed) return null;
    const diff = (new Date(ed).getTime() - new Date(st).getTime()) / 1000;
    return diff < hours * 3600
      ? { minHours: { required: hours, actual: diff/3600 } }
      : null;
  };
}