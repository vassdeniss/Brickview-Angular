import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css'],
})
export class LogoutComponent {
  constructor(
    private user: UserService,
    private router: Router,
    private token: TokenService
  ) {}

  ngOnInit(): void {
    this.user.logout().subscribe(() => {
      this.token.clearTokens();
      this.router.navigate(['']);
    });
  }
}
