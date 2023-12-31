import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ReviewService } from './review.service';
import { TestBed } from '@angular/core/testing';
import { Review, ReviewForm } from '../types/reviewType';
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
    const mockReview: ReviewForm = {
      _id: 'some-id',
      content: 'This was a fun build.',
      setVideoIds: '',
      setImages: [],
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
      _id: 'some-id',
      content: 'This was a fun build.',
      setImages: [],
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

  it('should delete a review by set ID', () => {
    // Arrange: create mock review ID
    const reviewId = '1';

    // Act: delete a review by review ID
    reviewService.deleteReview(reviewId).subscribe((response) => {
      expect(response).toBeTruthy();
      expect(response.status).toEqual(204);
    });

    // Assert: check that the request was sent correctly
    const req = httpMock.expectOne(
      `${environment.apiUrl}/reviews/delete/${reviewId}`
    );
    expect(req.request.method).toBe('DELETE');
  });

  it('should edit a review', () => {
    // Arrange: create mock review ID
    const review = {} as ReviewForm;

    // Act: edit a review by review ID
    reviewService.editReview(review).subscribe((response) => {
      expect(response).toBeTruthy();
      expect(response.status).toEqual(204);
    });

    // Assert: check that the request was sent correctly
    const req = httpMock.expectOne(`${environment.apiUrl}/reviews/edit`);
    expect(req.request.method).toBe('PATCH');
  });
});
