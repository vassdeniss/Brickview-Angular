import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Editor, Toolbar } from 'ngx-editor';
import { getFormValidationErrors } from 'src/app/auth/helpers';
import { PopupService } from 'src/app/services/popup.service';
import { ReviewService } from 'src/app/services/review.service';
import { Review } from 'src/app/types/reviewType';

@Component({
  selector: 'app-create-edit-review',
  templateUrl: './create-edit-review.component.html',
  styleUrls: ['./create-edit-review.component.css'],
})
export class CreateEditReviewComponent implements OnInit, OnDestroy {
  mode: 'create' | 'update' = 'create';
  errors: string[] = [];
  images: string[] = [];
  reviewForm = this.fb.group(
    {
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
      setVideoIds: ['', [this.linkValidator]],
      _id: [''],
    }
    // {
    //   validator: this.linkValidator('setVideoIds'),
    // }
  );

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
      if (review) {
        this.mode = 'update';
        this.images = review.setImages;
        this.reviewForm.patchValue({
          content: review.content,
        });
        this.reviewForm.patchValue({
          setImages: review.setImages,
        });
        this.reviewForm.patchValue({
          setVideoIds: review.setVideoIds
            .map((id: string) => `https://www.youtube.com/watch?v=${id}`)
            .join(', '),
        });
      }
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

    const result$ =
      this.mode === 'create'
        ? this.review.createReview(this.reviewForm.value as Review)
        : this.review.editReview(this.reviewForm.value as Review);

    result$.subscribe({
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

  linkValidator(control: AbstractControl) {
    console.log(control);

    if (control.value === '') {
      return null;
    }

    if (control.errors && !control.errors['invalidLinks']) {
      return null;
    }

    const links = control.value.split(',').map((link: string) => link.trim());
    const isValid = links.every((link: string) => isValidUrl(link));

    return isValid ? null : { invalidLinks: true };

    function isValidUrl(url: string) {
      const pattern =
        /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/gm;

      return pattern.test(url);
    }
  }
}
