import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { SetService } from 'src/app/services/set.service';
import { Set } from 'src/app/types/setType';

export const homeResolver: ResolveFn<Set[]> = (_) =>
  inject(SetService).getLatest();
