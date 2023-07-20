import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Set } from '../types/setType';
import { environment } from '../../environments/environment';

@Injectable()
export class SetService {
  constructor(private http: HttpClient) {}

  getCurrentUserSets(): Observable<Set[]> {
    return this.http.get<Set[]>(
      `${environment.apiUrl}/sets/logged-user-collection`
    );
  }

  addSet(setId: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/sets/add-set`, { setId });
  }
}
