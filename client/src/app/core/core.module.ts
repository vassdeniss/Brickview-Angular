import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';

@NgModule({
  declarations: [NavComponent, PagenotfoundComponent],
  imports: [CommonModule],
  exports: [NavComponent],
})
export class CoreModule {}
