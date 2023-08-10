import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { EditReviewComponent } from './edit-review.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PopupService } from 'src/app/services/popup.service';
import { ReviewService } from 'src/app/services/review.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxEditorModule } from 'ngx-editor';
import { of, throwError } from 'rxjs';

describe('EditReviewComponent', () => {
  let component: EditReviewComponent;
  let fixture: ComponentFixture<EditReviewComponent>;
  let mockPopupService: jasmine.SpyObj<PopupService>;
  let mockReviewService: jasmine.SpyObj<ReviewService>;
  let router: Router;
  let mockActivatedRoute: any;

  beforeEach(() => {
    const popupSpy = jasmine.createSpyObj('PopupService', ['show']);
    const reviewSpy = jasmine.createSpyObj('ReviewService', ['editReview']);
    mockActivatedRoute = {
      data: of({
        review: {
          setImages: [],
          content: 'some-content',
        },
      }),
      snapshot: {
        params: {
          id: 'test_set_id',
        },
      },
    };

    TestBed.configureTestingModule({
      declarations: [EditReviewComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, NgxEditorModule],
      providers: [
        { provide: PopupService, useValue: popupSpy },
        { provide: ReviewService, useValue: reviewSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });

    mockPopupService = TestBed.inject(
      PopupService
    ) as jasmine.SpyObj<PopupService>;
    mockReviewService = TestBed.inject(
      ReviewService
    ) as jasmine.SpyObj<ReviewService>;
    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(EditReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should populate with data on navigation', () => {
    // Arrange

    // Act: Call init
    component.ngOnInit();

    // Assert: check that the form was populated with the data
    expect(component.reviewForm.get('content')?.value).toEqual('some-content');
    expect(component.reviewForm.get('_id')?.value).toEqual('test_set_id');
  });

  it('should show error popup when form is invalid', () => {
    // Arrange: set up an invalid review form
    const button = {} as HTMLButtonElement;
    component.reviewForm.reset();
    component.reviewForm.get('content')?.setValue('');

    // Act: submit the form
    component.onSubmit(button);

    // Assert: check that the popup was shown and the button was disabled
    expect(mockPopupService.show).toHaveBeenCalled();
    expect(button.disabled).toBe(false);
    expect(component.errors).toContain('content is required!');
  });

  it('should edit review and navigate to "reviews/:id" on form submission', fakeAsync(() => {
    //Arrange: create mock review, setup service
    const reviewData = {
      content:
        '<p>Test review content lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum</p>',
      images: '',
      setImages: [],
      _id: 'test_set_id',
    };
    mockReviewService.editReview.and.returnValue(of(null));
    const button = {} as HTMLButtonElement;
    component.reviewForm.patchValue({
      content: reviewData.content,
    });
    component.reviewForm.patchValue({ _id: reviewData._id });
    const navigateSpy = spyOn(router, 'navigate');

    // Act: submit the form
    component.onSubmit(button);
    tick();

    // Assert: check that the method was called and the user was navigated to "reviews/:id"
    expect(mockReviewService.editReview).toHaveBeenCalledWith(reviewData);
    expect(navigateSpy).toHaveBeenCalledWith(['reviews', 'test_set_id']);
    expect(button.disabled).toBe(false);
  }));

  it('should show error popup when review edit fails', () => {
    // Arrange: setup service to throw error
    const button = {} as HTMLButtonElement;
    mockReviewService.editReview.and.returnValue(
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
