import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { PageSpinnerComponent } from './page-spinner/page-spinner.component';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { SearchComponent } from './search/search.component';
import { NgxEditorModule } from 'ngx-editor';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    NavComponent,
    PagenotfoundComponent,
    PageSpinnerComponent,
    HomeComponent,
    FooterComponent,
    SearchComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    NgxEditorModule,
    FormsModule,
  ],
  exports: [
    NavComponent,
    PageSpinnerComponent,
    FooterComponent,
    SearchComponent,
  ],
})
export class CoreModule {}
