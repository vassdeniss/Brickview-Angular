import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class TokenService {
  constructor(private http: HttpClient, private cookie: CookieService) {}

  saveToken(token: string): void {
    this.cookie.set('accessToken', token, { expires: 2, secure: true });
  }

  getToken(): string {
    return this.cookie.get('accessToken');
  }

  saveRefreshToken(refreshToken: string): void {
    this.cookie.set('refreshToken', refreshToken, { expires: 2, secure: true });
  }

  getRefreshToken(): string {
    return this.cookie.get('refreshToken');
  }
}
