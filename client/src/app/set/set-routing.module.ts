import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MySetsComponent } from './my-sets/my-sets.component';
import { routeGuard } from '../auth/route.guard';
import { mySetsResolver } from './my-sets/my-sets.resolver';
import { AddSetComponent } from './add-set/add-set.component';
import { UserSetsComponent } from './user-sets/user-sets.component';
import { userSetsResolver } from './user-sets/user-sets.resolver';

const routes: Routes = [
  {
    path: 'my-sets',
    component: MySetsComponent,
    canActivate: [routeGuard],
    resolve: { sets: mySetsResolver },
    title: 'My Sets',
  },
  {
    path: 'add-set',
    component: AddSetComponent,
    canActivate: [routeGuard],
    title: 'Add Sets',
  },
  {
    path: ':username',
    component: UserSetsComponent,
    resolve: { data: userSetsResolver },
    title: 'User Sets',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetRoutingModule {}
