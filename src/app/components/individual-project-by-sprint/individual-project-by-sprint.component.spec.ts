import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualProjectBySprintComponent } from './individual-project-by-sprint.component';

describe('IndividualProjectBySprintComponent', () => {
  let component: IndividualProjectBySprintComponent;
  let fixture: ComponentFixture<IndividualProjectBySprintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualProjectBySprintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualProjectBySprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
