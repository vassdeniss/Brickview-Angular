import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { EMPTY, Observable, catchError, finalize, tap, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { SpinnerService } from '../services/spinner.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private token: TokenService,
    private spinner: SpinnerService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.spinner.show();

    if (request.url.startsWith(environment.apiUrl)) {
      const token: string = this.token.getToken();
      const refreshToken: string = this.token.getRefreshToken();
      request = request.clone({
        setHeaders: {
          'X-Authorization': token,
          'X-Refresh': refreshToken,
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
        }
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.token.clearTokens();
          localStorage.removeItem('image');
          this.router.navigate(['auth/login']);
        }

        return EMPTY;
      }),
      finalize(() => {
        this.spinner.hide();
      })
    );
  }
}
