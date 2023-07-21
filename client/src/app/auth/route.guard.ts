import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const routeGuard: CanActivateFn = (_) => {
  return inject(AuthService).isAuthenticated();
};
