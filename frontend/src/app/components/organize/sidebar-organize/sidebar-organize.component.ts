import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar-organize',
  standalone: true,
  imports: [ RouterModule, CommonModule ],
  templateUrl: './sidebar-organize.component.html',
  styleUrl: './sidebar-organize.component.css'
})
export class SidebarOrganizeComponent {
  constructor(public authSvc: AuthService) {}
  
  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();
  items = [
    {
      routeLink: 'all-tournament',
      icon: 'bi-house-fill fs-5',
      label: 'ทัวร์นาเมนต์ทั้งหมด',
    },
    {
      routeLink: 'my-tournament',
      icon: 'bi bi-card-list',
      label: 'ทัวร์นาเมนต์ของฉัน',
    },
    {
      routeLink: 'create-tournament',
      icon: 'bi-clipboard-plus-fill',
      label: 'สร้างทัวร์นาเมนต์',
    },
    {
      routeLink: 'my-profile',
      icon: 'bi-person-lines-fill fa-2x',
      label: 'โปรไฟล์',
    },
  ]

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed())
  };
}
