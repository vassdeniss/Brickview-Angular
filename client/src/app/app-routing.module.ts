import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserSetListComponent } from './user/user-set-list/user-set-list.component';

const routes: Routes = [
  { path: 'user/vass/sets', component: UserSetListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
