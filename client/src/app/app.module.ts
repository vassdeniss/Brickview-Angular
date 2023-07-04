import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SetService } from './services/set.service';
import { NavComponent } from './nav/nav.component';
import { SetComponent } from './set/set.component';

@NgModule({
  declarations: [AppComponent, NavComponent, SetComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [SetService],
  bootstrap: [AppComponent],
})
export class AppModule {}
