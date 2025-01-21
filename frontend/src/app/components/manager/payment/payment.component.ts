import { Component } from '@angular/core';
import { NavComponent } from "../nav/nav.component"; // นำเข้าคอมโพเนนต์ NavComponent

@Component({
  selector: 'app-payment',
  standalone: true, // ใช้ standalone component
  imports: [NavComponent], // นำเข้า NavComponent
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  // ฟังก์ชันและตัวแปรต่างๆ
}
