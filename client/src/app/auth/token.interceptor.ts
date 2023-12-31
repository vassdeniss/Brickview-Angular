import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { EMPTY, Observable, catchError, finalize, tap, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { SpinnerService } from '../services/spinner.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private token: TokenService,
    private spinner: SpinnerService,
    private router: Router,
    private user: UserService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.spinner.show();

    if (request.url.startsWith(environment.apiUrl)) {
      const token: string = this.token.getToken();
      const refreshToken: string = this.token.getRefreshToken();
      const language: string =
        localStorage.getItem('preferred-language') || 'bg';
      request = request.clone({
        setHeaders: {
          'X-Authorization': token,
          'X-Refresh': refreshToken,
          'X-Language': language,
        },
      });
    }

    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (
          event instanceof HttpResponse &&
          request.url.startsWith(environment.apiUrl)
        ) {
          const newAccessToken = event.headers.get('X-Authorization');
          if (newAccessToken) {
            this.token.saveToken(newAccessToken);
          }

          const newRefreshToken = event.headers.get('X-Refresh');
          if (newRefreshToken) {
            this.token.saveRefreshToken(newRefreshToken);
          }

          const body = event.body;
          if (body && body.user && body.user.email) {
            this.user.updateUser(body.user);
          }
        }
      }),
      catchError((err) => {
        if (err.status === 401) {
          this.token.clearTokens();
          localStorage.removeItem('image');
          localStorage.removeItem('user');
          this.router.navigate(['auth/login']);
          return EMPTY;
        }

        if (err.status === 404 && request.url.includes('user-collection')) {
          this.router.navigate(['404']);
          return EMPTY;
        }

        return throwError(() => err);
      }),
      finalize(() => {
        this.spinner.hide();
      })
    );
  }
}
