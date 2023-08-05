import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { routeGuard } from '../auth/route.guard';
import { CreateReviewComponent } from './create-review/create-review.component';
import { DetailReviewComponent } from './detail-review/detail-review.component';
import { detailReviewResolver } from './detail-review/detail-review.resolver';

const routes: Routes = [
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewRoutingModule {}
