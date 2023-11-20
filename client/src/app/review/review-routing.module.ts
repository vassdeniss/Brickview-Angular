import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { routeGuard } from '../auth/route.guard';
import { DetailReviewComponent } from './detail-review/detail-review.component';
import { detailReviewResolver } from './detail-review/detail-review.resolver';
import { createEditReviewResolver } from './create-edit-review/create-edit-review.resolver';
import { AllReviewsComponent } from './all-reviews/all-reviews.component';
import { allReviewsResolver } from './all-reviews/all-reviews.resolver';
import { CreateEditReviewComponent } from './create-edit-review/create-edit-review.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: AllReviewsComponent,
    title: 'All Reviews',
    resolve: { sets: allReviewsResolver },
  },
  {
    path: ':id/create',
    component: CreateEditReviewComponent,
    canActivate: [routeGuard],
    title: 'Create Review',
  },
  {
    path: ':id',
    component: DetailReviewComponent,
    title: 'Review',
    resolve: { review: detailReviewResolver },
  },
  {
    path: ':id/edit',
    component: CreateEditReviewComponent,
    title: 'Edit Review',
    resolve: { review: createEditReviewResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewRoutingModule {}
