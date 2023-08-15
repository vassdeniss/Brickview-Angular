import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { EditInfoComponent } from './edit-info.component';
import { PopupService } from 'src/app/services/popup.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from 'src/app/services/user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { User } from 'src/app/types/userType';

describe('EditInfo Component', () => {
  let component: EditInfoComponent;
  let fixture: ComponentFixture<EditInfoComponent>;
  let mockPopupService: jasmine.SpyObj<PopupService>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let router: Router;
  let mockLocalStorage: any;

  beforeEach(() => {
    const popupSpy = jasmine.createSpyObj('PopupService', ['show']);
    const userSpy = jasmine.createSpyObj('UserService', ['editUser']);
    mockLocalStorage = {
      setItem: (key: string, value: string) => {},
      removeItem: (key: string) => {},
    };

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      declarations: [EditInfoComponent],
      providers: [
        { provide: PopupService, useValue: popupSpy },
        { provide: UserService, useValue: userSpy },
        { provide: 'localStorage', useValue: mockLocalStorage },
      ],
    });

    mockPopupService = TestBed.inject(
      PopupService
    ) as jasmine.SpyObj<PopupService>;
    mockUserService = TestBed.inject(
      UserService
    ) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(EditInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show error popup when form is invalid', () => {
    // Arrange: set up an invalid review form
    const button = {} as HTMLButtonElement;

    // Act: submit the form
    component.onSubmit(button);

    // Assert: check that the popup was shown and the button was disabled
    expect(mockPopupService.show).toHaveBeenCalled();
    expect(button.disabled).toBe(false);
    expect(component.errors).toContain('username is required!');
  });

  it('should edit user and navigate to "users/my-profile" on form submission', fakeAsync(() => {
    // Arrange: create mock, setup service
    const userData = {
      username: 'some-username',
      profilePicture: 'profile.jpg',
      deleteProfilePicture: true,
    };
    mockUserService.editUser.and.returnValue(of({} as User));
    const button = {} as HTMLButtonElement;
    component.editForm.patchValue({
      username: userData.username,
    });
    component.editForm.patchValue({
      profilePicture: userData.profilePicture,
    });
    component.editForm.patchValue({
      deleteProfilePicture: userData.deleteProfilePicture,
    });
    const navigateSpy = spyOn(router, 'navigate');
    const removeItemSpy = spyOn(window.localStorage, 'removeItem').and.callFake(
      (key) => {}
    );

    // Act: submit the form
    component.onSubmit(button);
    tick();

    // Assert: check that the method was called and the user was navigated to "users/my-profile"
    expect(mockUserService.editUser).toHaveBeenCalledWith(userData);
    expect(navigateSpy).toHaveBeenCalledWith(['users/my-profile']);
    expect(removeItemSpy).toHaveBeenCalledWith('image');
    expect(button.disabled).toBe(false);
  }));

  it('should edit user and navigate to "users/my-profile" on form submission (no deletion of image)', fakeAsync(() => {
    // Arrange: create mock, setup service
    const userData = {
      username: 'some-username',
      profilePicture: 'profile.jpg',
      deleteProfilePicture: false,
    };
    mockUserService.editUser.and.returnValue(of({} as User));
    const button = {} as HTMLButtonElement;
    component.editForm.patchValue({
      username: userData.username,
    });
    component.editForm.patchValue({
      profilePicture: userData.profilePicture,
    });
    component.editForm.patchValue({
      deleteProfilePicture: userData.deleteProfilePicture,
    });
    component.currentProfilePicture = userData.profilePicture;
    const navigateSpy = spyOn(router, 'navigate');
    const setItemSpy = spyOn(window.localStorage, 'setItem').and.callFake(
      (key, value) => {}
    );

    // Act: submit the form
    component.onSubmit(button);
    tick();

    // Assert: check that the method was called and the user was navigated to "users/my-profile"
    expect(mockUserService.editUser).toHaveBeenCalledWith(userData);
    expect(navigateSpy).toHaveBeenCalledWith(['users/my-profile']);
    expect(setItemSpy).toHaveBeenCalledWith('image', 'profile.jpg');
    expect(button.disabled).toBe(false);
  }));

  it('should show error popup when edit fails', () => {
    // Arrange: setup service to throw error
    const button = {} as HTMLButtonElement;
    mockUserService.editUser.and.returnValue(
      throwError(() => {
        return {
          error: {
            message: 'Error message',
          },
        };
      })
    );
    component.editForm.patchValue({
      username: 'some username',
    });

    // Act: submit the form
    component.onSubmit(button);

    // Assert: check that the error popup was shown and the button was disabled
    expect(component.errors).toEqual(['Error message']);
    expect(mockPopupService.show).toHaveBeenCalled();
    expect(button.disabled).toBe(false);
  });
});
