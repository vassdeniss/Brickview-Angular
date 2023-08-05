import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { SetService } from './set.service';
import { Set } from '../types/setType';
import { environment } from '../../environments/environment';

describe('SetService', () => {
  let setService: SetService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SetService],
    });

    setService = TestBed.inject(SetService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should get the current user sets', () => {
    // Arrange: make dummy sets
    const dummySets: Set[] = [
      {
        _id: 'some-id',
        setNum: '12345',
        name: 'Set 1',
        year: 2022,
        parts: 500,
        image: 'set1.jpg',
        minifigCount: 5,
        minifigs: [],
        review: '',
      },
      {
        _id: 'some-id',
        setNum: '67890',
        name: 'Set 2',
        year: 2023,
        parts: 300,
        image: 'set2.jpg',
        minifigCount: 3,
        minifigs: [],
        review: '',
      },
    ];

    // Act: call get current user sets
    setService.getCurrentUserSets().subscribe((sets: Set[]) => {
      expect(sets).toEqual(dummySets);
    });

    // Assert: method has been called, compare retrieved sets
    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/sets/logged-user-collection`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummySets);
  });

  it('should add a set', () => {
    // Arrange: make dummy set id
    const setId = '123';

    // Act: call add set
    setService.addSet(setId).subscribe((response: any) => {
      expect(response).toBeTruthy();
    });

    // Assert: method has been called, compare retrieved sets
    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/sets/add-set`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ setId });
    req.flush({});
  });
});
