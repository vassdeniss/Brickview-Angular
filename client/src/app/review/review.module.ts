import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReviewRoutingModule } from './review-routing.module';
import { DetailReviewComponent } from './detail-review/detail-review.component';
import { NgxEditorModule } from 'ngx-editor';
import { AllReviewsComponent } from './all-reviews/all-reviews.component';
import { CoreModule } from '../core/core.module';
import { TranslateModule } from '@ngx-translate/core';
import { CreateEditReviewComponent } from './create-edit-review/create-edit-review.component';

@NgModule({
  declarations: [
    DetailReviewComponent,
    AllReviewsComponent,
    CreateEditReviewComponent,
  ],
  imports: [
    CommonModule,
    ReviewRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgxEditorModule,
    FormsModule,
    CoreModule,
    TranslateModule,
  ],
  exports: [TranslateModule],
})
export class ReviewModule {}
