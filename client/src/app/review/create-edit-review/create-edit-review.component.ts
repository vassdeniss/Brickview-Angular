import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PopupService } from 'src/app/services/popup.service';
import { getFormValidationErrors } from '../../auth/helpers';
import { ReviewService } from 'src/app/services/review.service';
import { ReviewForm } from 'src/app/types/reviewType';
import { ActivatedRoute, Router } from '@angular/router';
import { Editor, Toolbar } from 'ngx-editor';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';

const YOUTUBE_URL_PATTERN =
    /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu\.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/;

export function youtubeLinksValidator(control: AbstractControl) {
  const rawValue = control.value ?? '';
  const value = rawValue.toString().trim();

  if (!value) {
    return null;
  }

  const links = value.split(',').map((link: string) => link.trim());
  const isValid = links.every((link: string) => YOUTUBE_URL_PATTERN.test(link));

  return isValid ? null : { invalidLinks: true };
}

@Component({
  selector: 'app-create-edit-review',
  templateUrl: './create-edit-review.component.html',
  styleUrls: ['./create-edit-review.component.css'],
})
export class CreateEditReviewComponent implements OnInit, OnDestroy {
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;

  isSubmitting: boolean = false;
  mode: 'create' | 'update' = 'create';
  errors: string[] = [];
  images: string[] = [];
  reviewForm = this.fb.group({
    content: ['', [Validators.required, Validators.minLength(50)]],
    setImages: [''],
    setVideoIds: ['', [youtubeLinksValidator]],
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
    this.editor = new Editor();

    const id = this.activated.snapshot.params['id'];
    if (id) {
      this.reviewForm.patchValue({ _id: id });
    }

    this.activated.data.subscribe(({ review }): void => {
      if (review) {
        this.mode = 'update';
        this.populateFormFromReview(review);
      }
    });
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  onSubmit(): void {
    this.isSubmitting = true;

    if (this.reviewForm.invalid) {
      this.showFormErrors();
      this.isSubmitting = false;
      return;
    }

    const form: ReviewForm = this.createPayload();
    const result$ =
      this.mode === 'create'
        ? this.review.createReview(form)
        : this.review.editReview(form);

    result$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.route.navigate(['reviews', this.reviewForm.get('_id')?.value]);
      },
      error: (err) => {
        this.errors = [];
        this.errors.push(err.error.message);
        this.popup.show();
        this.isSubmitting = false;
      },
    });
  }

  /* istanbul ignore next */
  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files: FileList | null = target.files;
    if (!files || files.length === 0) {
      return;
    }

    Array.from(files).forEach((file: File): void => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (): void => {
        const imageUrl = reader.result as string;
        this.images.push(imageUrl);
        this.insertImage(imageUrl);
      };
    });
  }

  deleteImage(index: number): void {
    const imageUrl: string = this.images[index];
    this.images.splice(index, 1);

    const inputEl: HTMLInputElement = this.imageInput.nativeElement;
    const files: FileList | null = inputEl.files;
    if (files) {
      const updatedFiles = new DataTransfer();
      Array.from(files).forEach((file: File, i: number): void => {
        if (i !== index) {
          updatedFiles.items.add(file);
        }
      });

      inputEl.files = updatedFiles.files;
    }

    this.removeImageFromEditor(imageUrl);
  }

  insertImage(url: string) {
    const imageHtml = `<img src="${url}" width="200"/>`;
    this.editor.commands.insertHTML(imageHtml).exec();
  }

  removeImageFromEditor(url: string) {
    const currentContent = this.reviewForm.value.content || '';

    const updatedContent = currentContent.replace(
        new RegExp(`<img[^>]+src=["']${url.split(',')[0]}["'][^>]*>`, 'g'),
        ''
    );

    this.reviewForm.patchValue({ content: updatedContent });
  }

  private populateFormFromReview(review: any): void {
    this.images = review.setImages ?? [];
    this.reviewForm.patchValue({
      content: review.content ?? '',
      setImages: review.setImages ?? [],
      setVideoIds: (review.setVideoIds ?? [])
          .map((id: string) => `https://www.youtube.com/watch?v=${id}`)
          .join(', '),
    });
  }

  private createPayload(): ReviewForm {
    return {
      _id: this.reviewForm.value._id as string,
      content: this.reviewForm.value.content as string,
      setVideoIds: this.reviewForm.value.setVideoIds as string,
      setImages: this.images,
    };
  }

  private showFormErrors(): void {
    this.errors = [];
    const errors = getFormValidationErrors(this.reviewForm);
    errors.forEach((error): void => {
      this.errors.push(`${error.control} ${error.message}`);
    });
    this.popup.show();
  }
}
