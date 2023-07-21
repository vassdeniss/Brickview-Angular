import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UserCurrentProfileComponent } from './user-current-profile/user-current-profile.component';

@NgModule({
  declarations: [UserCurrentProfileComponent],
  imports: [CommonModule, UserRoutingModule, SharedModule],
})
export class UserModule {}
