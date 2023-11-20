import { Component, Input } from '@angular/core';
import { Set } from 'src/app/types/setType';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  @Input() set: Set | undefined = undefined;
}
