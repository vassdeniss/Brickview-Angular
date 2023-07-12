import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { PageSpinnerComponent } from './page-spinner/page-spinner.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [NavComponent, PagenotfoundComponent, PageSpinnerComponent],
  imports: [CommonModule, SharedModule],
  exports: [NavComponent, PageSpinnerComponent],
})
export class CoreModule {}
