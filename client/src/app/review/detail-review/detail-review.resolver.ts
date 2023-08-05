import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ReviewService } from 'src/app/services/review.service';
import { Review } from 'src/app/types/reviewType';

export const detailReviewResolver: ResolveFn<Review> = (route, _) =>
  inject(ReviewService).getReview(route.params['id']);
