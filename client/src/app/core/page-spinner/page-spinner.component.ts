import { Component } from '@angular/core';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-page-spinner',
  templateUrl: './page-spinner.component.html',
  styleUrls: ['./page-spinner.component.css'],
})
export class PageSpinnerComponent {
  constructor(public spinner: SpinnerService) {}
}
