import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentReviewComponent } from './tournament-review.component';

describe('TournamentReviewComponent', () => {
  let component: TournamentReviewComponent;
  let fixture: ComponentFixture<TournamentReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TournamentReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TournamentReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
