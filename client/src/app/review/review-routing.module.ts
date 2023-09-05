import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { routeGuard } from '../auth/route.guard';
import { CreateReviewComponent } from './create-review/create-review.component';
import { DetailReviewComponent } from './detail-review/detail-review.component';
import { detailReviewResolver } from './detail-review/detail-review.resolver';
import { EditReviewComponent } from './edit-review/edit-review.component';
import { editReviewResolver } from './edit-review/edit-review.resolver';
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
    component: CreateReviewComponent,
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
    component: EditReviewComponent,
    title: 'Edit Review',
    resolve: { review: editReviewResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewRoutingModule {}
