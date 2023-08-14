import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserService } from '../services/user.service';

export const routeGuard: CanActivateFn = (_) =>
  inject(UserService).isAuthenticated;
