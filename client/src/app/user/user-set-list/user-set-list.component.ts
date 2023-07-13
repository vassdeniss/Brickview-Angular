import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PopupService } from 'src/app/services/popup.service';

import { Set } from 'src/app/types/setType';

@Component({
  selector: 'app-user-set-list',
  templateUrl: './user-set-list.component.html',
  styleUrls: ['./user-set-list.component.css'],
})
export class UserSetListComponent {
  sets: Set[] = [];

  constructor(private route: ActivatedRoute, public popup: PopupService) {}

  ngOnInit(): void {
    this.route.data.subscribe(({ sets }) => {
      this.sets = sets;
      if (this.sets.length <= 0) {
        this.popup.show();
      }
    });
  }
}
