import { TestBed } from '@angular/core/testing';

import { PlzService } from './plz.service';

describe('PlzServiceService', () => {
  let service: PlzService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlzService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
