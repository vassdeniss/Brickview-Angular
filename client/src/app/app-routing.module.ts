import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagenotfoundComponent } from './core/pagenotfound/pagenotfound.component';
import { HomeComponent } from './core/home/home.component';
import { homeResolver } from './core/home/home.resolver';
import { routeGuard } from './auth/route.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    title: 'Home',
    resolve: { sets: homeResolver },
  },
  {
    path: 'users',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
    canMatch: [routeGuard],
  },
  {
    path: 'sets',
    loadChildren: () => import('./set/set.module').then((m) => m.SetModule),
    canMatch: [routeGuard],
  },
  {
    path: 'reviews',
    loadChildren: () =>
      import('./review/review.module').then((m) => m.ReviewModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
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
