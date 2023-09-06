import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UserCurrentProfileComponent } from './user-current-profile/user-current-profile.component';
import { EditInfoComponent } from './edit-info/edit-info.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [UserCurrentProfileComponent, EditInfoComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  exports: [TranslateModule],
})
export class UserModule {}
