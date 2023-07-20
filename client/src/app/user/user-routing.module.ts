import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { routeGuard } from '../auth/route.guard';

const routes: Routes = [
  {
    canActivate: [routeGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
