import { Component } from '@angular/core';
import { NavComponent } from "../home/nav/nav.component";
import { RouterModule } from '@angular/router'; //ประกาศเพื่อใช้ routerLink ในการไปยังหน้าต่างๆ

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
