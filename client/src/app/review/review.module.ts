import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateReviewComponent } from './create-review/create-review.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ReviewRoutingModule } from './review-routing.module';
import { DetailReviewComponent } from './detail-review/detail-review.component';

@NgModule({
  declarations: [CreateReviewComponent, DetailReviewComponent],
  imports: [
    CommonModule,
    ReviewRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class ReviewModule {}
