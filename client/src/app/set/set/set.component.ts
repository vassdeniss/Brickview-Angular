import { Component, Input } from '@angular/core';
import { Set } from 'src/app/types/setType';

@Component({
  selector: 'app-set',
  templateUrl: './set.component.html',
  styleUrls: ['./set.component.css'],
})
export class SetComponent {
  @Input() legoSet: Set | undefined = undefined;
}
