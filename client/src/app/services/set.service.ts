import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Set } from '../types/setType';
import { Observable } from 'rxjs';

@Injectable()
export class SetService {
  constructor(private http: HttpClient) {}

  getSet(setId: string): Observable<Set> {
    return this.http.get<Set>(`http://localhost:3000/sets/${setId}`);
  }
}
