import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MySetsComponent } from './my-sets/my-sets.component';
import { SharedModule } from '../shared/shared.module';
import { SetComponent } from './set/set.component';
import { SetRoutingModule } from './set-routing.module';
import { AddSetComponent } from './add-set/add-set.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserSetsComponent } from './user-sets/user-sets.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MySetsComponent,
    SetComponent,
    AddSetComponent,
    UserSetsComponent,
  ],
  imports: [
    CommonModule,
    SetRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  exports: [TranslateModule],
})
export class SetModule {}
