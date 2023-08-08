import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Set } from 'src/app/types/setType';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  sets$!: Observable<Set[]>;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.sets$ = this.route.data.pipe(map((data) => data['sets']));
  }
}
