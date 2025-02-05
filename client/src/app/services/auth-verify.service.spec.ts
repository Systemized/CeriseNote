import { TestBed } from '@angular/core/testing';

import { AuthVerifyService } from './auth-verify.service';

describe('AuthVerifyService', () => {
  let service: AuthVerifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthVerifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
