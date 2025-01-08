import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTournamentComponent } from './my-tournament.component';

describe('MyTournamentComponent', () => {
  let component: MyTournamentComponent;
  let fixture: ComponentFixture<MyTournamentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyTournamentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyTournamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
