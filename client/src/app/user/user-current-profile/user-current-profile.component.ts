import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
import { User } from 'src/app/types/userType';

@Component({
  selector: 'app-user-current-profile',
  templateUrl: './user-current-profile.component.html',
  styleUrls: ['./user-current-profile.component.css'],
})
export class UserCurrentProfileComponent implements OnInit {
  //user$!: Observable<User | undefined>;
  user: User | undefined;
  image: string | null = localStorage.getItem('image');

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe(({ user }) => (this.user = user));
    // this.user = this.route.data.pipe(map(({ user }) => user));
  }
}
