import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntireReleaseAllComponent } from './entire-release-all.component';

describe('EntireReleaseAllComponent', () => {
  let component: EntireReleaseAllComponent;
  let fixture: ComponentFixture<EntireReleaseAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntireReleaseAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntireReleaseAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
