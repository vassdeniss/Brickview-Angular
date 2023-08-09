import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PopupService } from 'src/app/services/popup.service';
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

  constructor(private route: ActivatedRoute, public popup: PopupService) {}

  ngOnInit(): void {
    this.route.data.subscribe(({ data }) => {
      this.sets = data.sets;
      this.user = data.user;
      if (this.sets.length <= 0) {
        this.popup.show();
      }
    });
  }
}
