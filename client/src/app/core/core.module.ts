import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { PageSpinnerComponent } from './page-spinner/page-spinner.component';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    NavComponent,
    PagenotfoundComponent,
    PageSpinnerComponent,
    HomeComponent,
  ],
  imports: [CommonModule, SharedModule, RouterModule],
  exports: [NavComponent, PageSpinnerComponent],
})
export class CoreModule {}
