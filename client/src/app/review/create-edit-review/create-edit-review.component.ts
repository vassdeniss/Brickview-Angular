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

@Component({
  selector: 'app-create-edit-review',
  templateUrl: './create-edit-review.component.html',
  styleUrls: ['./create-edit-review.component.css'],
})
export class CreateEditReviewComponent implements OnInit, OnDestroy {
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;

  mode: 'create' | 'update' = 'create';
  errors: string[] = [];
  images: string[] = [];
  reviewForm = this.fb.group({
    content: ['', [Validators.required, Validators.minLength(50)]],
    setImages: [''],
    setVideoIds: ['', [this.linkValidator]],
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

  onSubmit(button: any): void {
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

    const form: ReviewForm = {
      _id: this.reviewForm.value._id as string,
      content: this.reviewForm.value.content as unknown as string,
      setVideoIds: this.reviewForm.value.setVideoIds as string,
      setImages: this.images,
    };

    const result$ =
      this.mode === 'create'
        ? this.review.createReview(form)
        : this.review.editReview(form);

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
        const imageUrl = reader.result as string;
        this.images.push(imageUrl);
        this.insertImage(imageUrl);
      };
    }
  }

  deleteImage(index: number) {
    const imageUrl = this.images[index];
    this.images.splice(index, 1);

    const files = this.imageInput.nativeElement.files!;
    const updatedFiles = new DataTransfer();
    for (let i = 0; i < files.length; i++) {
      if (i !== index) {
        updatedFiles.items.add(files[i]);
      }
    }

    this.imageInput.nativeElement.files = updatedFiles.files;
    this.removeImageFromEditor(imageUrl);
  }

  insertImage(url: string) {
    const imageHtml = `<img src="${url}" width="200"/>`;
    this.editor.commands.insertHTML(imageHtml).exec();
  }

  removeImageFromEditor(url: string) {
    const currentContent = this.reviewForm.value.content || '';

    // Create a regex pattern to match the image tag
    const updatedContent = currentContent.replace(
      new RegExp(`<img[^>]+src=["']${url.split(',')[0]}[^>]*>`, 'g'),
      ''
    );

    // Update the form control with the new content
    this.reviewForm.patchValue({ content: updatedContent });
  }

  linkValidator(control: AbstractControl) {
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
