import { Component } from '@angular/core';

import { SetService } from 'src/app/services/set.service';
import { Set } from 'src/app/types/setType';

@Component({
  selector: 'app-user-set-list',
  templateUrl: './user-set-list.component.html',
  styleUrls: ['./user-set-list.component.css'],
})
export class UserSetListComponent {
  sets: Set[] = [];

  showPopup = false;

  constructor(private set: SetService) {}

  ngOnInit(): void {
    this.set.getSet('10129').subscribe({
      next: (data) => this.sets.push(data),
      error: (err) => console.error(err),
      complete: () => {
        if (this.sets.length <= 0) {
          this.showPopup = true;
        }
      },
    });
    // this.set.getSet('10179').subscribe((data) => {
    //   this.sets.push(data);
    // });
    // this.set.getSet('10030').subscribe((data) => {
    //   this.sets.push(data);
    // });
    // this.set.getSet('10174').subscribe((data) => {
    //   this.sets.push(data);
    // });
    // this.set.getSet('71374').subscribe((data) => {
    //   this.sets.push(data);
    // });
    // this.set.getSet('1111').subscribe((data) => {
    //   this.sets.push(data);
    // });
  }

  closePopup(): void {
    this.showPopup = false;
  }
}
