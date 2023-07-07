import { Component, Input } from '@angular/core';

import { Set } from 'src/app/types/setType';

@Component({
  selector: 'app-user-set',
  templateUrl: './user-set.component.html',
  styleUrls: ['./user-set.component.css'],
})
export class UserSetComponent {
  isReviewed: boolean = false;

  @Input() legoSet: Set | undefined = undefined;
}
