import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserSetListComponent } from './user-set-list/user-set-list.component';
import { routeGuard } from '../auth/route.guard';
import { userSetListResolver } from './user-set-list/user-set-list.resolver';

const routes: Routes = [
  {
    path: 'users/vass/sets',
    component: UserSetListComponent,
    canActivate: [routeGuard],
    resolve: { sets: userSetListResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
