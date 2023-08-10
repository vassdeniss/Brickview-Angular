import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopupService } from 'src/app/services/popup.service';
import { getFormValidationErrors } from '../helpers';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterCredentials } from 'src/app/types/credentialsType';
import { JwtTokens } from 'src/app/types/tokenType';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm = this.fb.group(
    {
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      repeatPassword: ['', [Validators.required]],
      image: [''],
    },
    {
      validator: this.confirmedValidator('password', 'repeatPassword'),
    }
  );
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
    if (this.registerForm.invalid) {
      this.errors = [];
      const errors = getFormValidationErrors(this.registerForm);
      errors.forEach((error) => {
        this.errors.push(`${error.control} ${error.message}`);
      });
      this.popup.show();
      button.disabled = false;
      return;
    }

    this.user
      .register(this.registerForm.value as RegisterCredentials)
      .subscribe({
        next: (tokens: JwtTokens) => {
          localStorage.setItem('image', this.registerForm.value.image);
          this.token.saveToken(tokens.accessToken);
          this.token.saveRefreshToken(tokens.refreshToken);
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

  /* istanbul ignore next */
  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;

    if (target.files === null) {
      return;
    }

    const image: File = target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      this.registerForm.patchValue({ image: reader.result as string });
    };
  }

  confirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (control.errors && !control.errors['notSame']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        control.setErrors({ notSame: true });
      } else {
        control.setErrors(null);
      }
    };
  }
}
