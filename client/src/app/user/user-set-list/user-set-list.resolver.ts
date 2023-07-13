import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { SetService } from 'src/app/services/set.service';

import { Set } from 'src/app/types/setType';

export const userSetListResolver: ResolveFn<Set[]> = (
  route: ActivatedRouteSnapshot,
  _
) => inject(SetService).getUserSets('75978');
