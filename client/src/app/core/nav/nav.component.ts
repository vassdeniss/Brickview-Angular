import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
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
    private token: TokenService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLogged = this.token.getToken() ? true : false;
        this.image = localStorage.getItem('image') || '';
      }
    });

    this.translate.setDefaultLang('bg');
    const storedLanguage = localStorage.getItem('preferred-language');
    this.translate.use(storedLanguage || 'bg');
  }

  changeLanguage(langauge: string) {
    this.translate.use(langauge);
    localStorage.setItem('preferred-language', langauge);
  }
}
