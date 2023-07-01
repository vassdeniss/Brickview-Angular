import { Component, Input } from '@angular/core';
import { Set } from '../types/setType';

@Component({
  selector: 'app-set',
  templateUrl: './set.component.html',
  styleUrls: ['./set.component.css'],
})
export class SetComponent {
  @Input() legoSet: Set | undefined = undefined;
}
