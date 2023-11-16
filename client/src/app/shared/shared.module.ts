import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupComponent } from './popup/popup.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { CardComponent } from './card/card.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [PopupComponent, SpinnerComponent, CardComponent],
  imports: [CommonModule, RouterModule, TranslateModule],
  exports: [PopupComponent, SpinnerComponent, CardComponent],
})
export class SharedModule {}
