import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/types/userType';

@Component({
  selector: 'app-user-current-profile',
  templateUrl: './user-current-profile.component.html',
  styleUrls: ['./user-current-profile.component.css'],
})
export class UserCurrentProfileComponent implements OnInit {
  user: User | undefined = undefined;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe(({ user }) => {
      this.user = user;
    });
  }
}
