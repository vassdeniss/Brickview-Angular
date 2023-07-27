import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { routeGuard } from '../auth/route.guard';
import { CreateReviewComponent } from './create-review/create-review.component';
import { DetailReviewComponent } from './detail-review/detail-review.component';

const routes: Routes = [
  {
    path: 'reviews/:id/create',
    component: CreateReviewComponent,
    canActivate: [routeGuard],
    title: 'Create Review',
  },
  {
    path: 'reviews/:id',
    component: DetailReviewComponent,
    title: 'Review',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewRoutingModule {}
