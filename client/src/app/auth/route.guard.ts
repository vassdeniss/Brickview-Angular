import { inject } from '@angular/core';
import { CanActivateChildFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const routeGuard: CanActivateChildFn = (_) =>
  inject(AuthService).isAuthenticated();
