import { TestBed } from '@angular/core/testing';

import { CompetencelistService } from './competencelist.service';

describe('CompetencelistService', () => {
  let service: CompetencelistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompetencelistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
