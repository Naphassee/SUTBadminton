import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-organize',
  standalone: true,
  imports: [ RouterModule, CommonModule ],
  templateUrl: './sidebar-organize.component.html',
  styleUrl: './sidebar-organize.component.css'
})
export class SidebarOrganizeComponent {
  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();
  items = [
    {
      routeLink: 'my-tournament',
      icon: 'bi-house-fill fs-5',
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
    {
      routeLink: 'tournament-review',
      icon: 'bi-chat-left-dots-fill fa-2x',
      label: 'ผลการรีวิวทัวร์นาเมนต์ของฉัน',
    },
    {
      routeLink: 'membership',
      icon: 'bi-star-fill fa-2x',
      label: 'การเป็นสมาชิก',
    },
  ]

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed())
  };
}
