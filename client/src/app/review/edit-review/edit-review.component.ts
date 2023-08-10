import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Editor, Toolbar } from 'ngx-editor';
import { getFormValidationErrors } from 'src/app/auth/helpers';
import { PopupService } from 'src/app/services/popup.service';
import { ReviewService } from 'src/app/services/review.service';
import { Review } from 'src/app/types/reviewType';

@Component({
  selector: 'app-edit-review',
  templateUrl: './edit-review.component.html',
  styleUrls: ['./edit-review.component.css'],
})
export class EditReviewComponent {
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
    this.activated.data.subscribe(({ review }) => {
      this.images = review.setImages;
      this.reviewForm.patchValue({
        content: review.content,
      });
    });

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

    this.review.editReview(this.reviewForm.value as Review).subscribe({
      next: () => {
        button.disabled = false;
        this.route.navigate(['reviews', this.reviewForm.get('_id')?.value]);
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
