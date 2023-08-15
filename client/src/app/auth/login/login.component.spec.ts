import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { UserService } from 'src/app/services/user.service';
import { PopupService } from 'src/app/services/popup.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TokenService } from 'src/app/services/token.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { JwtTokens } from 'src/app/types/tokenType';
import { User } from 'src/app/types/userType';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userService: UserService;
  let popupService: PopupService;
  let router: Router;
  let tokenService: TokenService;

  beforeEach(() => {
    const tokenServiceMock = {
      saveToken: jasmine.createSpy('saveToken'),
      saveRefreshToken: jasmine.createSpy('saveRefreshToken'),
    };

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      declarations: [LoginComponent],
      providers: [
        FormBuilder,
        UserService,
        PopupService,
        { provide: TokenService, useValue: tokenServiceMock },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    popupService = TestBed.inject(PopupService);
    router = TestBed.inject(Router);
    tokenService = TestBed.inject(TokenService);
    fixture.detectChanges();
  });

  it('should show popup and display form validation errors when form is invalid', () => {
    // Arrange: set up an invalid username value in the login form, spy on the popup
    const button = {} as HTMLButtonElement;
    component.loginForm.get('username')?.setValue('');
    spyOn(popupService, 'show');

    // Act: call the onSubmit method with a fake button element
    component.onSubmit(button);

    // Assert: check that the popup is shown and form validation errors are displayed
    expect(component.errors).toContain('username is required!');
    expect(component.errors).toContain('password is required!');
    expect(popupService.show).toHaveBeenCalled();
    expect(button.disabled).toBe(false);
  });

  it('should call AuthService.login and navigate to home on successful login', fakeAsync(() => {
    // Arrange: setup login method, emails, spies
    const button = {} as HTMLButtonElement;
    spyOn(userService, 'login').and.returnValue(
      of({
        tokens: {
          accessToken: 'token',
          refreshToken: 'refresh',
        } as JwtTokens,
        user: {} as User,
        image: 'profile.jpg',
      })
    );
    const navigateSpy = spyOn(router, 'navigate');
    component.loginForm.get('username')?.setValue('testusername');
    component.loginForm.get('password')?.setValue('password');

    // Act: call the onSubmit method with a fake button element
    // Wait for the asynchronous operations to complete using fakeAsync and tick
    component.onSubmit(button);
    tick();

    // Assert: that AuthService.login was called with the correct credentials
    // and that tokens are saved and navigation to home is triggered
    expect(localStorage.getItem('image')).toBe('profile.jpg');
    expect(userService.login).toHaveBeenCalledWith({
      username: 'testusername',
      password: 'password',
    });
    expect(tokenService.saveToken).toHaveBeenCalledWith('token');
    expect(tokenService.saveRefreshToken).toHaveBeenCalledWith('refresh');
    expect(navigateSpy).toHaveBeenCalledWith(['']);
    expect(button.disabled).toBe(false);
  }));

  it('should display error popup when login fails', fakeAsync(() => {
    // Arrange: mock the AuthService.login method to return an error, and make spies
    const button = {} as HTMLButtonElement;
    const errorMessage = 'Invalid credentials';
    spyOn(userService, 'login').and.returnValue(
      throwError(() => {
        return {
          error: {
            message: errorMessage,
          },
        };
      })
    );
    spyOn(popupService, 'show');
    component.loginForm.get('username')?.setValue('testusername');
    component.loginForm.get('password')?.setValue('wrong-password');

    // Act: call the onSubmit method with a fake button element
    // Wait for the asynchronous operations to complete using fakeAsync and tick
    component.onSubmit(button);
    tick();

    // Assert: that an error message is displayed in the popup
    expect(component.errors).toEqual([errorMessage]);
    expect(popupService.show).toHaveBeenCalled();
    expect(button.disabled).toBe(false);
  }));
});
