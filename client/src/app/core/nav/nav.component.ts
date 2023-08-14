import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  isLogged: boolean = false;
  image: string = '';

  constructor(
    public user: UserService,
    private router: Router,
    private token: TokenService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLogged = this.token.getToken() ? true : false;
        this.image = localStorage.getItem('image') || '';
      }
    });
  }
}
