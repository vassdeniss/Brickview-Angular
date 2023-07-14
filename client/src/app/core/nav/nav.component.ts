import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
  isLogged: boolean = false;
  image: string = '';

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    this.auth.isAuthenticated().subscribe((isLogged) => {
      this.isLogged = isLogged;
      this.image = localStorage.getItem('image') || '';
    });
  }
}
