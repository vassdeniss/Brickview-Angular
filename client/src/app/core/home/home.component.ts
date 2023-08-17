import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { SetService } from 'src/app/services/set.service';
import { Set } from 'src/app/types/setType';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  sets$!: Observable<Set[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private setService: SetService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sets$ = this.activatedRoute.data.pipe(map((data) => data['sets']));
  }

  searchSets(setNumber?: string) {
    if (setNumber) {
      this.router.navigate([''], {
        queryParams: { setNumber },
      });
      this.sets$ = this.setService.getAll(setNumber);
    } else {
      this.sets$ = this.setService.getAll();
    }
  }
}
