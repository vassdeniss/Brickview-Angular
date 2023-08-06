import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateReviewComponent } from './create-review/create-review.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReviewRoutingModule } from './review-routing.module';
import { DetailReviewComponent } from './detail-review/detail-review.component';
import { NgxEditorModule } from 'ngx-editor';

@NgModule({
  declarations: [CreateReviewComponent, DetailReviewComponent],
  imports: [
    CommonModule,
    ReviewRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgxEditorModule,
    FormsModule,
  ],
})
export class ReviewModule {}