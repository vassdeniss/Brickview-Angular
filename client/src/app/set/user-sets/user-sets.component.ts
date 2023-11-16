import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Set } from 'src/app/types/setType';
import { User } from 'src/app/types/userType';

@Component({
  selector: 'app-user-sets',
  templateUrl: './user-sets.component.html',
  styleUrls: ['./user-sets.component.css'],
})
export class UserSetsComponent {
  user: User | undefined = undefined;
  sets: Set[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe(({ data }) => {
      this.sets = data.sets.sort((a: Set, b: Set) => {
        if (a.year - b.year !== 0) {
          return a.year - b.year;
        }

        return Number(a.setNum) - Number(b.setNum);
      });
      this.user = data.user;
    });
  }
}
