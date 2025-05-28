import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyProfileComponent } from "../../organize/my-profile/my-profile.component";
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MyProfileComponent, RouterModule, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  constructor(public authSvc: AuthService) {}
}
 