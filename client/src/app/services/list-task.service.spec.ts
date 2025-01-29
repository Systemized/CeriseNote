import { TestBed } from '@angular/core/testing';

import { ListTaskService } from './list-task.service';

describe('ListTaskService', () => {
  let service: ListTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
