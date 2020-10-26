import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualProjectByReleaseComponent } from './individual-project-by-release.component';

describe('IndividualProjectByReleaseComponent', () => {
  let component: IndividualProjectByReleaseComponent;
  let fixture: ComponentFixture<IndividualProjectByReleaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualProjectByReleaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualProjectByReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
