import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { SetService } from './set.service';
import { Set } from '../types/setType';

describe('SetService', () => {
  let service: SetService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SetService],
    });

    service = TestBed.inject(SetService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve a set', () => {
    const setId = '1234';
    const mockSet: Set = {
      set_num: '12345',
      name: 'Test Set',
      year: 2023,
      theme_id: 1,
      num_parts: 100,
      set_img_url: 'https://example.com/test-set.jpg',
      set_url: 'https://example.com/test-set',
    };

    service.getSet(setId).subscribe((set: Set) => {
      expect(set).toEqual(mockSet);
    });

    const request = httpMock.expectOne(`http://localhost:3000/sets/${setId}`);
    expect(request.request.method).toBe('GET');
    request.flush(mockSet);
  });
});
