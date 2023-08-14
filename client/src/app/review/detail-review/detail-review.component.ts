import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Editor } from 'ngx-editor';
import { UserService } from 'src/app/services/user.service';
import { PopupService } from 'src/app/services/popup.service';
import { ReviewService } from 'src/app/services/review.service';
import { Review } from 'src/app/types/reviewType';

@Component({
  selector: 'app-detail-review',
  templateUrl: './detail-review.component.html',
  styleUrls: ['./detail-review.component.css'],
})
export class DetailReviewComponent implements OnInit, OnDestroy {
  review: Review | undefined = undefined;
  isImageEnlarged: boolean = false;
  enlargeImageSource: string = '';
  isOwner: boolean = false;
  customPopupContent: string | undefined = undefined;
  editor!: Editor;

  constructor(
    private reviewService: ReviewService,
    private route: ActivatedRoute,
    private routeNavigate: Router,
    public popup: PopupService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(({ review }) => {
      this.review = review;
    });
    this.editor = new Editor();
    this.isOwner = this.userService.user?._id === this.review?.userId;
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  enlargeImage(image?: string): void {
    this.popup.show();
    this.enlargeImageSource = image || '';
  }

  deleteReview(): void {
    this.reviewService.deleteReview(this.review?._id as string).subscribe({
      next: () => {
        this.routeNavigate.navigate(['sets/my-sets']);
      },
      error: (err) => {
        this.customPopupContent = err.error.message;
        this.popup.show();
      },
    });
  }
}
