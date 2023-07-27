import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ReviewService } from './review.service';
import { TestBed } from '@angular/core/testing';
import { Review } from '../types/reviewType';
import { environment } from 'src/environments/environment';

describe('ReviewService', () => {
  let reviewService: ReviewService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReviewService],
    });
    reviewService = TestBed.inject(ReviewService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create a new review', () => {
    // Arrange: create mock review
    const mockReview: Review = {
      buildExperience: 'This was a fun build.',
      design: 'This set looks great.',
      value: 'This set is a great value.',
      other: 'This set is awesome.',
      verdict: 'This set is great.',
      imageSources: [],
      set: '1',
    };

    // Act: create a new review with mock review
    reviewService.createReview(mockReview).subscribe((response) => {
      expect(response).toBeTruthy();
      expect(response).toEqual(mockReview);
    });

    // Assert: check that the request was sent correctly
    const req = httpMock.expectOne(`${environment.apiUrl}/reviews/create`);
    expect(req.request.method).toBe('POST');
    req.flush(mockReview);
  });

  it('should get a review by set ID', () => {
    // Arrange: create mock review and set ID
    const setId = '1';
    const mockReview: Review = {
      buildExperience: 'This was a fun build.',
      design: 'This set looks great.',
      value: 'This set is a great value.',
      other: 'This set is awesome.',
      verdict: 'This set is great.',
      imageSources: [],
      set: '1',
    };

    // Act: get a review by set ID
    reviewService.getReview(setId).subscribe((response) => {
      expect(response).toBeTruthy();
      expect(response).toEqual(mockReview);
    });

    // Assert: check that the request was sent correctly
    const req = httpMock.expectOne(
      `${environment.apiUrl}/reviews/get/${setId}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockReview);
  });
});
