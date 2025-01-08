import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SandbagComponent } from './sandbag.component';

describe('SandbagComponent', () => {
  let component: SandbagComponent;
  let fixture: ComponentFixture<SandbagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SandbagComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SandbagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
