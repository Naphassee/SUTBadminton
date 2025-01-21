import { Component, HostListener, OnInit, Inject, PLATFORM_ID, WritableSignal, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SidebarOrganizeComponent } from './sidebar-organize/sidebar-organize.component';
import { MainOrganizeComponent } from './main-organize/main-organize.component';

@Component({
  selector: 'app-organize',
  standalone: true,
  imports: [SidebarOrganizeComponent, MainOrganizeComponent],
  templateUrl: './organize.component.html',
  styleUrls: ['./organize.component.css']
})
export class OrganizeComponent implements OnInit {
  isLeftSidebarCollapsed: WritableSignal<boolean> = signal<boolean>(false);
  screenWidth: WritableSignal<number> = signal<number>(1000);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.screenWidth.set(window.innerWidth);
      this.isLeftSidebarCollapsed.set(this.screenWidth() < 768);
    } else {
      this.screenWidth.set(1000); // กำหนดค่าเริ่มต้นสำหรับ SSR
      this.isLeftSidebarCollapsed.set(true); // กำหนดค่าเริ่มต้นสำหรับ SSR
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      this.screenWidth.set(window.innerWidth);
      this.isLeftSidebarCollapsed.set(this.screenWidth() < 768);
    }
  }

  ngOnInit(): void {
    this.isLeftSidebarCollapsed.set(this.screenWidth() < 768);
  }

  changeIsLeftSidebarCollapsed(isLeftSidebarCollapsed: boolean): void {
    this.isLeftSidebarCollapsed.set(isLeftSidebarCollapsed);
  }
}
