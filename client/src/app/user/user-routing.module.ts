import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { routeGuard } from '../auth/route.guard';
import { UserCurrentProfileComponent } from './user-current-profile/user-current-profile.component';
import { userCurrentProfileResolver } from './user-current-profile/user-current-profile.resolver';
import { EditInfoComponent } from './edit-info/edit-info.component';

const routes: Routes = [
  {
    path: 'my-profile',
    component: UserCurrentProfileComponent,
    canActivate: [routeGuard],
    resolve: { user: userCurrentProfileResolver },
    title: 'My Profile',
  },
  {
    path: 'edit',
    component: EditInfoComponent,
    canActivate: [routeGuard],
    title: 'Edit Profile',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
