import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MySetsComponent } from './my-sets/my-sets.component';
import { routeGuard } from '../auth/route.guard';
import { mySetsResolver } from './my-sets/my-sets.resolver';
import { AddSetComponent } from './add-set/add-set.component';

const routes: Routes = [
  {
    path: 'sets/my-sets',
    component: MySetsComponent,
    canActivate: [routeGuard],
    resolve: { sets: mySetsResolver },
  },
  {
    path: 'sets/add-set',
    component: AddSetComponent,
    canActivate: [routeGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetRoutingModule {}
