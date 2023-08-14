import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { UserService } from 'src/app/services/user.service';
import { PopupService } from 'src/app/services/popup.service';
import { TokenService } from 'src/app/services/token.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userService: UserService;
  let popupService: PopupService;
  let tokenService: TokenService;
  let router: Router;

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
      declarations: [RegisterComponent],
      providers: [
        FormBuilder,
        UserService,
        PopupService,
        { provide: TokenService, useValue: tokenServiceMock },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    popupService = TestBed.inject(PopupService);
    tokenService = TestBed.inject(TokenService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should show popup and display form validation errors when form is invalid', () => {
    // Arrange: set invalid fields
    const button = {} as HTMLButtonElement;
    component.registerForm.get('username')?.setValue('abc');
    component.registerForm.get('email')?.setValue('invalid-email');
    spyOn(popupService, 'show');

    // Act: call the onSubmit method with a fake button element
    component.onSubmit(button);

    // Assert: that there are errors and the popup is shown
    expect(component.errors).toContain(
      'username should be at least 4 characters!'
    );
    expect(component.errors).toContain('email is not valid!');
    expect(component.errors).toContain('password is required!');
    expect(component.errors).toContain('repeatPassword is required!');
    expect(popupService.show).toHaveBeenCalled();
    expect(button.disabled).toBe(false);
  });

  it('should call AuthService.register and navigate to home on successful registration', fakeAsync(() => {
    // Arrange: set form values, spies
    const button = {} as HTMLButtonElement;
    const registerSpy = spyOn(userService, 'register').and.returnValue(
      of({ accessToken: 'token', refreshToken: 'refresh' })
    );
    const navigateSpy = spyOn(router, 'navigate');
    component.registerForm.get('username')?.setValue('testuser');
    component.registerForm.get('email')?.setValue('test@example.com');
    component.registerForm.get('password')?.setValue('securepassword');
    component.registerForm.get('repeatPassword')?.setValue('securepassword');

    // Act: call the onSubmit method with a fake button element
    component.onSubmit(button);
    tick();

    // Assert: that the AuthService.register method was called with the correct values
    expect(localStorage.getItem('image')).toBe('');
    expect(registerSpy).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'test@example.com',
      password: 'securepassword',
      repeatPassword: 'securepassword',
      image: '',
    });
    expect(tokenService.saveToken).toHaveBeenCalledWith('token');
    expect(tokenService.saveRefreshToken).toHaveBeenCalledWith('refresh');
    expect(navigateSpy).toHaveBeenCalledWith(['']);
    expect(button.disabled).toBe(false);
  }));

  it('should display error popup when registration fails', fakeAsync(() => {
    // Arrange: set form values, spies
    const button = {} as HTMLButtonElement;
    const errorMessage = 'Registration failed';
    spyOn(userService, 'register').and.returnValue(
      throwError(() => {
        return { error: { message: errorMessage } };
      })
    );
    spyOn(popupService, 'show');
    component.registerForm.get('username')?.setValue('testuser');
    component.registerForm.get('email')?.setValue('test@example.com');
    component.registerForm.get('password')?.setValue('securepassword');
    component.registerForm.get('repeatPassword')?.setValue('securepassword');

    // Act: call the onSubmit method with a fake button element
    component.onSubmit(button);
    tick();

    // Assert: that an error message is displayed in the popup
    expect(component.errors).toContain(errorMessage);
    expect(popupService.show).toHaveBeenCalled();
    expect(button.disabled).toBe(false);
  }));

  it('should update the form errors when passwords do not match', () => {
    // Arrange: set form values
    component.registerForm.get('password')?.setValue('password1');
    component.registerForm.get('repeatPassword')?.setValue('password2');

    // Act: call the confirmedValidator method
    component.confirmedValidator(
      'password',
      'repeatPassword'
    )(component.registerForm);

    // Assert: that the form has an error
    expect(component.registerForm.get('password')?.hasError('notSame')).toBe(
      true
    );
  });
});
