import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

import { User } from 'src/app/types/userType';

export const userCurrentProfileResolver: ResolveFn<User> = (_) =>
  inject(UserService).getLoggedUser();
