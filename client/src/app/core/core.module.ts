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
import { TranslateModule } from '@ngx-translate/core';
import { PlayerComponent } from './player/player.component';
import { YouTubePlayerModule } from '@angular/youtube-player';

@NgModule({
  declarations: [
    NavComponent,
    PagenotfoundComponent,
    PageSpinnerComponent,
    HomeComponent,
    FooterComponent,
    SearchComponent,
    PlayerComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    NgxEditorModule,
    FormsModule,
    TranslateModule,
    YouTubePlayerModule,
  ],
  exports: [
    NavComponent,
    PageSpinnerComponent,
    FooterComponent,
    SearchComponent,
    TranslateModule,
    PlayerComponent,
  ],
})
export class CoreModule {}
