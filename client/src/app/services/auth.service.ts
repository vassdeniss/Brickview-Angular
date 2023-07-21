import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, catchError, map, of } from 'rxjs';

import {
  LoginCredentials,
  RegisterCredentials,
} from '../types/credentialsType';
import { JwtTokens } from '../types/tokenType';
import { environment } from '../../environments/environment';
import { User } from '../types/userType';
import { Router, UrlTree } from '@angular/router';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private token: TokenService
  ) {}

  // TODO: clean input
  // TODO: test
  register(credentials: RegisterCredentials): Observable<JwtTokens> {
    return this.http.post<JwtTokens>(
      `${environment.apiUrl}/users/register`,
      credentials
    );
  }

  // TODO: test
  login(credentials: LoginCredentials): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users/login`, credentials);
  }

  // TODO: test
  logout(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/logout`);
  }

  // TODO: test
  isAuthenticated(): Observable<boolean | UrlTree> {
    return this.http.get<boolean>(`${environment.apiUrl}/validate-token`).pipe(
      map((data: any) => data.resolution === 'Authenticated'),
      catchError(() => {
        this.token.clearTokens();
        return of(this.router.createUrlTree(['auth/login']));
      })
    );
  }

  getLoggedUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/get-logged-user`);
  }
}
