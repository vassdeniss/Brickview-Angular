import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Set } from 'src/app/types/setType';

export const mySetsResolver: ResolveFn<Set[]> = (_) =>
  inject(UserService).user?.sets!;
