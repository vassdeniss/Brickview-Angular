import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { Router, UrlTree } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';

describe('AuthService', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;
  let tokenService: TokenService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService, TokenService],
    });

    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
    router = TestBed.inject(Router);
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
    const mockResponse = { accessToken: 'abc', refreshToken: 'xyz' };

    // Act: register a user with mock credentials
    authService.register(mockCredentials).subscribe((tokens) => {
      expect(tokens).toEqual(mockResponse);
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
      email: 'testuser@mail.com',
      password: 'testpass',
    };
    const mockResponse = { accessToken: 'abc', refreshToken: 'xyz' };

    // Act: login a user with mock credentials
    authService.login(mockCredentials).subscribe((tokens) => {
      expect(tokens).toEqual(mockResponse);
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
    authService.logout().subscribe();

    // Assert: check that the request was sent correctly
    const req = httpMock.expectOne(`${environment.apiUrl}/users/logout`);
    expect(req.request.method).toBe('GET');
  });

  it('should check if a user is authenticated', () => {
    // Arrange:

    // Act: check if authenticated
    authService.isAuthenticated().subscribe((result) => {
      expect(result).toBeTruthy();
    });

    // Assert: check that the request was sent correctly
    const req = httpMock.expectOne(`${environment.apiUrl}/validate-token`);
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('should get the logged-in user', () => {
    // Arrange: create mock user
    const mockUser = {
      _id: '123',
      username: 'testuser',
      email: 'testuser@mail.com',
      sets: [],
    };

    // Act: get logged-in user
    authService.getLoggedUser().subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    // Assert: check that the request was sent correctly
    const req = httpMock.expectOne(
      `${environment.apiUrl}/users/get-logged-user`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });
});
