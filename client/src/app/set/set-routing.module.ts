import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MySetsComponent } from './my-sets/my-sets.component';
import { routeGuard } from '../auth/route.guard';
import { mySetsResolver } from './my-sets/my-sets.resolver';

const routes: Routes = [
  {
    path: 'sets/my-sets',
    component: MySetsComponent,
    canActivate: [routeGuard],
    resolve: { sets: mySetsResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetRoutingModule {}
