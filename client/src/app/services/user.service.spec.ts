import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should send a PATCH request to edit user', () => {
    // Arrange: create mock form data
    const formData = {
      username: 'testuser',
      image: 'testimage',
    };

    // Act: call the editUser method with a mock form data
    service.editUser(formData).subscribe((response: any) => {
      expect(response).toBeTruthy();
    });

    // Assert: check that the request was sent correctly
    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/users/edit`
    );
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toBe(formData);
  });
});
