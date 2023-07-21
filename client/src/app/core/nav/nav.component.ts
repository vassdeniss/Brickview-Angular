import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  isLogged: boolean = false;
  image: string = '';

  constructor(
    public auth: AuthService,
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
