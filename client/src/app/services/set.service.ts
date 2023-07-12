import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Set } from '../types/setType';
import { environment } from '../../environments/environment';

@Injectable()
export class SetService {
  constructor(private http: HttpClient) {}

  getSet(setId: string): Observable<Set> {
    return this.http.get<Set>(`${environment.apiUrl}/sets/${setId}`);
  }

  // TODO: Test
  getUserSets(userId: string): Observable<Set[]> {
    return new Observable<Set[]>((subscriber) => {
      subscriber.next([]);
    });
  }
}
