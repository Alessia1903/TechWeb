import { TestBed } from '@angular/core/testing';

import { RestBackend } from './rest-backend';

describe('RestBackend', () => {
  let service: RestBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestBackend);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
