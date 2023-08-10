import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PopupService } from 'src/app/services/popup.service';
import { getFormValidationErrors } from '../../auth/helpers';
import { ReviewService } from 'src/app/services/review.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Review } from 'src/app/types/reviewType';
import { Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-create-review',
  templateUrl: './create-review.component.html',
  styleUrls: ['./create-review.component.css'],
})
export class CreateReviewComponent implements OnInit, OnDestroy {
  errors: string[] = [];
  images: string[] = [];
  reviewForm = this.fb.group({
    content: [
      '',
      [
        Validators.required,
        Validators.minLength(50),
        Validators.maxLength(5000),
      ],
    ],
    images: [''],
    setImages: [this.images],
    _id: [''],
  });

  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  constructor(
    private activated: ActivatedRoute,
    private route: Router,
    private fb: FormBuilder,
    public popup: PopupService,
    private review: ReviewService
  ) {}

  ngOnInit(): void {
    this.reviewForm.patchValue({
      _id: this.activated.snapshot.params['id'],
    });
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  onSubmit(button: HTMLButtonElement): void {
    button.disabled = true;
    if (this.reviewForm.invalid) {
      this.errors = [];
      const errors = getFormValidationErrors(this.reviewForm);
      errors.forEach((error) => {
        this.errors.push(`${error.control} ${error.message}`);
      });
      this.popup.show();
      button.disabled = false;
      return;
    }

    this.review.createReview(this.reviewForm.value as Review).subscribe({
      next: () => {
        button.disabled = false;
        this.route.navigate(['sets/my-sets']);
      },
      error: (err) => {
        this.errors = [];
        this.errors.push(err.error.message);
        this.popup.show();
        button.disabled = false;
      },
    });
  }

  /* istanbul ignore next */
  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;

    if (target.files === null) {
      return;
    }

    const fileAmount = target.files.length;
    for (let i = 0; i < fileAmount; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(target.files[i]);
      reader.onload = () => {
        this.images.push(reader.result as string);
        this.reviewForm.patchValue({
          setImages: this.images,
        });
      };
    }
  }

  deleteImage(index: number) {
    this.images.splice(index, 1);
    this.reviewForm.patchValue({
      setImages: this.images,
    });
  }
}
