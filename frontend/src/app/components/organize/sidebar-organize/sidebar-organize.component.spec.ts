import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarOrganizeComponent } from './sidebar-organize.component';

describe('SidebarOrganizeComponent', () => {
  let component: SidebarOrganizeComponent;
  let fixture: ComponentFixture<SidebarOrganizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarOrganizeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarOrganizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
