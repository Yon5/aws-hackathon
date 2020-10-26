import { TestBed } from '@angular/core/testing';

import { UsTraceabilityService } from './us-traceability.service';

describe('UsTraceabilityService', () => {
  let service: UsTraceabilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsTraceabilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
