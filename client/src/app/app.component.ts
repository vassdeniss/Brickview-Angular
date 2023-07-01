import { Component, OnInit } from '@angular/core';
import { SetService } from './services/set.service';
import { Set } from './types/setType';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  resultSet: Set | undefined = undefined;

  constructor(private set: SetService) {}

  ngOnInit(): void {
    this.set.getSet('8273').subscribe((data) => {
      this.resultSet = data;
    });
  }
}
