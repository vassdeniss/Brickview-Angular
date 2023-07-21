import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { SetService } from './services/set.service';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { SpinnerService } from './services/spinner.service';
import { PopupService } from './services/popup.service';

import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { SetModule } from './set/set.module';

import { TokenRequestInterceptor } from './auth/token-request.interceptor';
import { TokenResponseInterceptor } from './auth/token-response.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    UserModule,
    AuthModule,
    SetModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [
    SetService,
    AuthService,
    TokenService,
    SpinnerService,
    PopupService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenRequestInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenResponseInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
