import { TestBed } from '@angular/core/testing';

import { SplitManagerService } from './split-manager.service';

describe('SplitManagerService', () => {
  let service: SplitManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SplitManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
