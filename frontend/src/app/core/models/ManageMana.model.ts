export interface ManageMana {
// Model สำหรับข้อมูลผู้จัดการ (Manager) ที่ใช้ในระบบ
  _id?: string; // ID จาก MongoDB (optional ตอนสร้าง)
  firstName: string;
  lastName: string;
  gender: string;
  age: string; // ใน Mongoose model เป็น String, ถ้าต้องการเป็น number ให้ปรับ
  role: 'Amateur' | 'Professional'; // Enum type
}
