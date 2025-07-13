import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCompetencesComponent } from './user-competences.component';

describe('UserCompetencesComponent', () => {
  let component: UserCompetencesComponent;
  let fixture: ComponentFixture<UserCompetencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCompetencesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCompetencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
