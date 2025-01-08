import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingMembershipComponent } from './setting-membership.component';

describe('SettingMembershipComponent', () => {
  let component: SettingMembershipComponent;
  let fixture: ComponentFixture<SettingMembershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingMembershipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
