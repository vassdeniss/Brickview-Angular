import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { SetService } from './services/set.service';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';

import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    UserModule,
    AuthModule,
    AppRoutingModule,
  ],
  providers: [
    SetService,
    AuthService,
    TokenService,
  ],
  providers: [SetService],
  bootstrap: [AppComponent],
})
export class AppModule {}
