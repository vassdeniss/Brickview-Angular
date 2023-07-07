import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserSetListComponent } from './user-set-list/user-set-list.component';

const routes: Routes = [
  { path: 'users/vass/sets', component: UserSetListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
