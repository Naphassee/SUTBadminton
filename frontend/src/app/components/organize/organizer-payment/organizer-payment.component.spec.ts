import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerPaymentComponent } from './organizer-payment.component';

describe('OrganizerPaymentComponent', () => {
  let component: OrganizerPaymentComponent;
  let fixture: ComponentFixture<OrganizerPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerPaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
