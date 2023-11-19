import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { routeGuard } from '../auth/route.guard';
import { DetailReviewComponent } from './detail-review/detail-review.component';
import { detailReviewResolver } from './detail-review/detail-review.resolver';
import { AllReviewsComponent } from './all-reviews/all-reviews.component';
import { allReviewsResolver } from './all-reviews/all-reviews.resolver';

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
    title: 'Edit Review',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewRoutingModule {}
