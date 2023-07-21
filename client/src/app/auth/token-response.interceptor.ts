import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, finalize, tap } from 'rxjs';
import { TokenService } from '../services/token.service';
import { SpinnerService } from '../services/spinner.service';

@Injectable()
export class TokenResponseInterceptor implements HttpInterceptor {
  constructor(private token: TokenService, private spinner: SpinnerService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
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
      finalize(() => {
        this.spinner.hide();
      })
    );
  }
}
