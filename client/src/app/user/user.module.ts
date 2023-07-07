import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSetListComponent } from './user-set-list/user-set-list.component';
import { UserSetComponent } from './user-set/user-set.component';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [UserSetListComponent, UserSetComponent],
  imports: [CommonModule, UserRoutingModule, SharedModule],
})
export class UserModule {}
