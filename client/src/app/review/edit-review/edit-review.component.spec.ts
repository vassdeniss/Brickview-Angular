import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditReviewComponent } from './edit-review.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PopupService } from 'src/app/services/popup.service';
import { ReviewService } from 'src/app/services/review.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxEditorModule } from 'ngx-editor';

describe('EditReviewComponent', () => {
  let component: EditReviewComponent;
  let fixture: ComponentFixture<EditReviewComponent>;
  let mockPopupService: jasmine.SpyObj<PopupService>;
  let mockReviewService: jasmine.SpyObj<ReviewService>;
  let router: Router;

  beforeEach(() => {
    const popupSpy = jasmine.createSpyObj('PopupService', ['show']);
    const reviewSpy = jasmine.createSpyObj('ReviewService', ['createReview']);

    TestBed.configureTestingModule({
      declarations: [EditReviewComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, NgxEditorModule],
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

    fixture = TestBed.createComponent(EditReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
