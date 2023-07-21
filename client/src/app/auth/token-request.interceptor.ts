import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpEventType,
} from '@angular/common/http';
import { Observable, filter, map, tap } from 'rxjs';
import { TokenService } from '../services/token.service';
import { SpinnerService } from '../services/spinner.service';

@Injectable()
export class TokenRequestInterceptor implements HttpInterceptor {
  constructor(private token: TokenService, private spinner: SpinnerService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.spinner.show();

    const token: string = this.token.getToken();
    const refreshToken: string = this.token.getRefreshToken();
    if (!token || !refreshToken) {
      return next.handle(request);
    }

    request = request.clone({
      setHeaders: {
        'X-Authorization': token,
        'X-Refresh': refreshToken,
      },
    });

    return next.handle(request);
  }
}
