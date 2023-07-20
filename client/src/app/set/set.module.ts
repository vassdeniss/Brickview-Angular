import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MySetsComponent } from './my-sets/my-sets.component';
import { SharedModule } from '../shared/shared.module';
import { SetComponent } from './set/set.component';
import { SetRoutingModule } from './set-routing.module';
import { AddSetComponent } from './add-set/add-set.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [MySetsComponent, SetComponent, AddSetComponent],
  imports: [CommonModule, SetRoutingModule, SharedModule, ReactiveFormsModule],
})
export class SetModule {}
