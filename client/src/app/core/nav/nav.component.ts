import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, UrlTree } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  isLogged: boolean = false;
  image: string = '';

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.auth.isAuthenticated().subscribe((isLogged: boolean | UrlTree) => {
          typeof isLogged === 'boolean'
            ? (this.isLogged = isLogged)
            : (this.isLogged = false);
          this.image = localStorage.getItem('image') || '';
        });
      }
    });
  }
}
