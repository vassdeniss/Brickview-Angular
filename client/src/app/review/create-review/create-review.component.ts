import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopupService } from 'src/app/services/popup.service';
import { getFormValidationErrors } from '../../auth/helpers';
import { ReviewService } from 'src/app/services/review.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewCreateForm } from 'src/app/types/reviewType';
import { Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-create-review',
  templateUrl: './create-review.component.html',
  styleUrls: ['./create-review.component.css'],
})
export class CreateReviewComponent implements OnInit, OnDestroy {
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;

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
      setImages: [''],
      setVideoIds: [''],
      _id: [''],
    },
    {
      validator: this.linkValidator('setVideoIds'),
    }
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

    const form: ReviewCreateForm = {
      _id: this.reviewForm.value._id,
      content: this.reviewForm.value.content,
      setVideoIds: this.reviewForm.value.setVideoIds,
      setImages: this.images,
    };

    this.review.createReview(form).subscribe({
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
      };
    }
  }

  deleteImage(index: number) {
    this.images.splice(index, 1);

    const files = this.imageInput.nativeElement.files!;
    const updatedFiles = new DataTransfer();
    for (let i = 0; i < files.length; i++) {
      if (i !== index) {
        updatedFiles.items.add(files[i]);
      }
    }

    this.imageInput.nativeElement.files = updatedFiles.files;
  }

  linkValidator(controlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];

      if (control.value === '') {
        return;
      }

      if (control.errors && !control.errors['invalidLinks']) {
        return;
      }

      const links = control.value.split(',').map((link: string) => link.trim());
      const isValid = links.every((link: string) => this.isValidUrl(link));

      isValid
        ? control.setErrors(null)
        : control.setErrors({ invalidLinks: true });

      return isValid ? null : { invalidLinks: true };
    };
  }

  isValidUrl(url: string) {
    const pattern =
      /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/gm;

    return pattern.test(url);
  }
}
