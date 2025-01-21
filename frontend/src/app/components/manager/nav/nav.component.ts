import { Component } from '@angular/core';
import { MyProfileComponent } from "../../organize/my-profile/my-profile.component";

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MyProfileComponent],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {

}
