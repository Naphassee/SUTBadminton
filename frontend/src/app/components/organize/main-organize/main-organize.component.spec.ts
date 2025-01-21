import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainOrganizeComponent } from './main-organize.component';

describe('MainOrganizeComponent', () => {
  let component: MainOrganizeComponent;
  let fixture: ComponentFixture<MainOrganizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainOrganizeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainOrganizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
