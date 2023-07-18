// import { TokenService } from './token.service';
// import { HttpClient } from '@angular/common/http';
// import { CookieService } from 'ngx-cookie-service';

// describe('TokenService', () => {
//   let tokenService: TokenService;
//   let httpSpy: jasmine.SpyObj<HttpClient>;
//   let cookieServiceSpy: jasmine.SpyObj<CookieService>;

//   beforeEach(() => {
//     httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
//     cookieServiceSpy = jasmine.createSpyObj('CookieService', ['set', 'get']);
//     tokenService = new TokenService(httpSpy, cookieServiceSpy);
//   });

//   it('should save token to cookie', () => {
//     // Arrange: make sample token
//     const token = 'sampleToken';

//     // Act: save token to cookie
//     tokenService.saveToken(token);

//     // Assert: token set has been called with 'accessToken'
//     expect(cookieServiceSpy.set).toHaveBeenCalledWith('accessToken', token, {
//       expires: 2,
//       secure: true,
//     });
//   });

//   it('should retrieve token from cookie', () => {
//     // Arrange: make sample token, setup cookie get
//     const token = 'sampleToken';
//     cookieServiceSpy.get.and.returnValue(token);

//     // Act: call get token
//     const retrievedToken = tokenService.getToken();

//     // Assert: method has been called, compare retrieved token
//     expect(cookieServiceSpy.get).toHaveBeenCalledWith('accessToken');
//     expect(retrievedToken).toBe(token);
//   });

//   it('should save refresh token to cookie', () => {
//     // Arrange: make sample token
//     const refreshToken = 'sampleRefreshToken';

//     // Act: save refresh token to cookie
//     tokenService.saveRefreshToken(refreshToken);

//     // Assert: token set has been called with 'refreshToken'
//     expect(cookieServiceSpy.set).toHaveBeenCalledWith(
//       'refreshToken',
//       refreshToken,
//       {
//         expires: 2,
//         secure: true,
//       }
//     );
//   });

//   it('should retrieve refresh token from cookie', () => {
//     // Arrange: make sample token, setup cookie get
//     const refreshToken = 'sampleRefreshToken';
//     cookieServiceSpy.get.and.returnValue(refreshToken);

//     // Act: call get refresh token
//     const retrievedRefreshToken = tokenService.getRefreshToken();

//     // Assert: method has been called, compare retrieved token
//     expect(cookieServiceSpy.get).toHaveBeenCalledWith('refreshToken');
//     expect(retrievedRefreshToken).toBe(refreshToken);
//   });
// });
