import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css'],
})
export class LogoutComponent {
  constructor(
    private auth: AuthService,
    private router: Router,
    private token: TokenService
  ) {}

  ngOnInit(): void {
    this.auth.logout().subscribe(() => {
      this.token.clearTokens();
      localStorage.clear();
      this.router.navigate(['']);
    });
  }
}
