import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTournamentComponent } from './all-tournament.component';

describe('AllTournamentComponent', () => {
  let component: AllTournamentComponent;
  let fixture: ComponentFixture<AllTournamentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllTournamentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllTournamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
