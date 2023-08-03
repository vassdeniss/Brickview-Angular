import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Set } from 'src/app/types/setType';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  sets: Set[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe(({ sets }) => {
      this.sets = sets;
    });
  }
}
