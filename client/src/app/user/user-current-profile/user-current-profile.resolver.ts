import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

import { User } from 'src/app/types/userType';

export const userCurrentProfileResolver: ResolveFn<User> = (_) =>
  inject(AuthService).getLoggedUser();
