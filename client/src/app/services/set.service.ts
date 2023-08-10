import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Set } from '../types/setType';
import { environment } from '../../environments/environment';

@Injectable()
export class SetService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Set[]> {
    return this.http.get<Set[]>(`${environment.apiUrl}/sets/allWithReviews`);
  }

  getCurrentUserSets(): Observable<Set[]> {
    return this.http.get<Set[]>(
      `${environment.apiUrl}/sets/logged-user-collection`
    );
  }

  getUserSets(username: string): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/sets/user-collection/${username}`
    );
  }

  addSet(setId: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/sets/add-set`, { setId });
  }

  deleteSet(setId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/sets/delete/${setId}`);
  }
}
