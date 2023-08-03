import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagenotfoundComponent } from './core/pagenotfound/pagenotfound.component';
import { HomeComponent } from './core/home/home.component';
import { homeResolver } from './core/home/home.resolver';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    title: 'Home',
    resolve: { sets: homeResolver },
  },
  {
    path: '**',
    pathMatch: 'full',
    component: PagenotfoundComponent,
    title: '404',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
