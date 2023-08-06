import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { getFormValidationErrors } from '../helpers';
import { AuthService } from 'src/app/services/auth.service';
import { PopupService } from 'src/app/services/popup.service';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { LoginCredentials } from 'src/app/types/credentialsType';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
  errors: string[] = [];

  constructor(
    private route: Router,
    private fb: FormBuilder,
    public popup: PopupService,
    private user: AuthService,
    private token: TokenService
  ) {}

  onSubmit(button: HTMLButtonElement): void {
    button.disabled = true;
    if (this.loginForm.invalid) {
      this.errors = [];
      const errors = getFormValidationErrors(this.loginForm);
      errors.forEach((error) => {
        this.errors.push(`${error.control} ${error.message}`);
      });
      this.popup.show();
      button.disabled = false;
      return;
    }

    this.user.login(this.loginForm.value as LoginCredentials).subscribe({
      next: (data) => {
        localStorage.setItem('image', data.image);
        this.token.saveToken(data.accessToken);
        this.token.saveRefreshToken(data.refreshToken);
        button.disabled = false;
        this.route.navigate(['']);
      },
      error: (err) => {
        this.errors = [];
        this.errors.push(err.error.message);
        this.popup.show();
        button.disabled = false;
      },
    });
  }
}