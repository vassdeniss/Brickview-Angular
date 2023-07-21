import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LogoutComponent } from './logout/logout.component';
import { routeGuard } from './route.guard';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: 'auth/register',
    component: RegisterComponent,
    title: 'Register',
  },
  {
    path: 'auth/login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'auth/logout',
    component: LogoutComponent,
    canActivate: [routeGuard],
    title: 'Logout',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
