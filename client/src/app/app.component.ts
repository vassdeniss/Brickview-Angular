import { Component, OnInit } from '@angular/core';
import { SetService } from './services/set.service';
import { Set } from './types/setType';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  sets: Set[] = [];

  constructor(private set: SetService) {}

  ngOnInit(): void {
    this.set.getSet('10129').subscribe((data) => {
      this.sets.push(data);
    });
    this.set.getSet('10179').subscribe((data) => {
      this.sets.push(data);
    });
    this.set.getSet('10030').subscribe((data) => {
      this.sets.push(data);
    });
  }
}
