import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, catchError, map, of } from 'rxjs';

import { RegisterCredentials } from '../types/credentialsType';
import { JwtTokens } from '../types/tokenType';
import { environment } from '../../environments/environment';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private token: TokenService) {}

  // TODO: clean input
  // TODO: test
  register(credentials: RegisterCredentials): Observable<JwtTokens> {
    return this.http.post<JwtTokens>(
      `${environment.apiUrl}/users/register`,
      credentials
    );
  }

  // TODO: test
  isAuthenticated(): Observable<boolean> {
    return this.http.get(`${environment.apiUrl}/validate-token`).pipe(
      map((data: any) => data.resolution === 'Authenticated'),
      catchError(() => of(false))
    );
  }
}
