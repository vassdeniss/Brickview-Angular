import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const routeGuard: CanActivateFn = (_) => {
  const isLogged = inject(AuthService).isAuthenticated();
  if (!isLogged) {
    inject(Router).navigate(['/auth/login']);
  }

  return isLogged;
};
