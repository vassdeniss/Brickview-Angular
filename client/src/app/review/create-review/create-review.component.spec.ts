import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { CreateReviewComponent } from './create-review.component';
import { PopupService } from 'src/app/services/popup.service';
import { ReviewService } from 'src/app/services/review.service';
import { Router } from '@angular/router';

describe('CreateReviewComponent', () => {
  let component: CreateReviewComponent;
  let fixture: ComponentFixture<CreateReviewComponent>;
  let mockPopupService: jasmine.SpyObj<PopupService>;
  let mockReviewService: jasmine.SpyObj<ReviewService>;
  let router: Router;

  beforeEach(() => {
    const popupSpy = jasmine.createSpyObj('PopupService', ['show']);
    const reviewSpy = jasmine.createSpyObj('ReviewService', ['createReview']);

    TestBed.configureTestingModule({
      declarations: [CreateReviewComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: PopupService, useValue: popupSpy },
        { provide: ReviewService, useValue: reviewSpy },
      ],
    });

    mockPopupService = TestBed.inject(
      PopupService
    ) as jasmine.SpyObj<PopupService>;
    mockReviewService = TestBed.inject(
      ReviewService
    ) as jasmine.SpyObj<ReviewService>;
    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(CreateReviewComponent);
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
  });

  it('should create review and navigate to "sets/my-sets" on form submission', fakeAsync(() => {
    // Arrange: create mock review, setup service
    const reviewData = {
      content:
        'Test review content lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
      setImages: [],
      _id: 'test_set_id',
    };
    mockReviewService.createReview.and.returnValue(of(reviewData));
    const button = {} as HTMLButtonElement;
    component.reviewForm.patchValue({
      content:
        'Test review content lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
    });
    component.reviewForm.patchValue({ _id: 'test_set_id' });
    const navigateSpy = spyOn(router, 'navigate');

    // Act: submit the form
    component.onSubmit(button);
    tick();

    // Assert: check that the review was created and the user was navigated to "sets/my-sets"
    expect(mockReviewService.createReview).toHaveBeenCalledWith(reviewData);
    expect(navigateSpy).toHaveBeenCalledWith(['sets/my-sets']);
    expect(button.disabled).toBe(false);
  }));

  it('should show error popup when review creation fails', () => {
    // Arrange: setup service to throw error
    const button = {} as HTMLButtonElement;
    mockReviewService.createReview.and.returnValue(
      throwError(() => {
        return {
          error: {
            message: 'Error message',
          },
        };
      })
    );
    component.reviewForm.patchValue({
      content:
        'Test review content lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
    });
    component.reviewForm.patchValue({ _id: 'test_set_id' });

    // Act: submit the form
    component.onSubmit(button);

    // Assert: check that the error popup was shown and the button was disabled
    expect(component.errors).toEqual(['Error message']);
    expect(mockPopupService.show).toHaveBeenCalled();
    expect(button.disabled).toBe(false);
  });

  it('should delete an image from the form', () => {
    // Arrange: setup images and imageSources
    component.images = ['image1', 'image2', 'image3'];
    component.reviewForm.patchValue({
      setImages: ['image1', 'image2', 'image3'],
    });

    // Act: delete an image
    component.deleteImage(1);

    // Assert: check that the image was deleted from the form
    expect(component.images).toEqual(['image1', 'image3']);
    expect(component.reviewForm.get('setImages')?.value).toEqual([
      'image1',
      'image3',
    ]);
  });
});
