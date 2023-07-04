import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { SetService } from './set.service';
import { Set } from '../types/setType';
import { environment } from '../../environments/environment';

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
      setNum: '12345',
      name: 'Test Set',
      year: 2023,
      parts: 100,
      image: 'https://example.com/test-set.jpg',
      minifigCount: 1,
    };

    service.getSet(setId).subscribe((set: Set) => {
      expect(set).toEqual(mockSet);
    });

    const request = httpMock.expectOne(`${environment.apiUrl}/sets/${setId}`);
    expect(request.request.method).toBe('GET');
    request.flush(mockSet);
  });
});
