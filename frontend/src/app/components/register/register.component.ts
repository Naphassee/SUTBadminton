import { Component } from '@angular/core';
import { NavComponent } from '../login/nav/nav.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NavComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

}
