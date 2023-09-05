import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { SetService } from 'src/app/services/set.service';
import { Set } from 'src/app/types/setType';

@Component({
  selector: 'app-all-reviews',
  templateUrl: './all-reviews.component.html',
  styleUrls: ['./all-reviews.component.css'],
})
export class AllReviewsComponent {
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
