import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupComponent } from './popup/popup.component';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  declarations: [PopupComponent, SpinnerComponent],
  imports: [CommonModule],
  exports: [PopupComponent, SpinnerComponent],
})
export class SharedModule {}
