import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { routeGuard } from '../auth/route.guard';
import { UserCurrentProfileComponent } from './user-current-profile/user-current-profile.component';
import { userCurrentProfileResolver } from './user-current-profile/user-current-profile.resolver';

const routes: Routes = [
  {
    path: 'users/my-profile',
    component: UserCurrentProfileComponent,
    canActivate: [routeGuard],
    resolve: { user: userCurrentProfileResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
