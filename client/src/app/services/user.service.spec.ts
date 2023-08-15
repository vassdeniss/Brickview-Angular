import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TokenService } from './token.service';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { AuthData } from '../types/authType';

describe('UserService', () => {
  let userService: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [UserService, TokenService],
    });

    userService = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should register a user', () => {
    // Arrange: create mocks
    const mockCredentials = {
      username: 'testuser',
      email: 'testuser@mail.com',
      password: 'testpass',
      repeatPassword: 'testpass',
    };
    const mockResponse = {
      user: {},
      tokens: { accessToken: 'abc', refreshToken: 'xyz' },
    } as AuthData;

    // Act: register a user with mock credentials
    userService.register(mockCredentials).subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    // Assert: check that the request was sent correctly
    const req = httpMock.expectOne(`${environment.apiUrl}/users/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCredentials);
    req.flush(mockResponse);
  });

  it('should login a user', () => {
    // Arrange: create mocks
    const mockCredentials = {
      username: 'testuserusername',
      password: 'testpass',
    };
    const mockResponse = {
      user: {},
      tokens: { accessToken: 'abc', refreshToken: 'xyz' },
    } as AuthData;

    // Act: login a user with mock credentials
    userService.login(mockCredentials).subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    // Assert: check that the request was sent correctly
    const req = httpMock.expectOne(`${environment.apiUrl}/users/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCredentials);
    req.flush(mockResponse);
  });

  it('should logout a user', () => {
    // Arrange:

    // Act: logout a user with mock credentials
    userService.logout().subscribe();

    // Assert: check that the request was sent correctly
    const req = httpMock.expectOne(`${environment.apiUrl}/users/logout`);
    expect(req.request.method).toBe('GET');
  });

  it('should send a PATCH request to edit user', () => {
    // Arrange: create mock form data
    const formData = {
      username: 'testuser',
      image: 'testimage',
    };

    // Act: call the editUser method with a mock form data
    userService.editUser(formData).subscribe((response: any) => {
      expect(response).toBeTruthy();
    });

    // Assert: check that the request was sent correctly
    const req = httpMock.expectOne(`${environment.apiUrl}/users/edit`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toBe(formData);
  });
});
