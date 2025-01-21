import { Component } from '@angular/core';
import { NavComponent } from "./nav/nav.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NavComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

}
