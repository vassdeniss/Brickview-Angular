import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MySetsComponent } from './my-sets/my-sets.component';
import { routeGuard } from '../auth/route.guard';
import { mySetsResolver } from './my-sets/my-sets.resolver';
import { AddSetComponent } from './add-set/add-set.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetRoutingModule {}
