import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Editor } from 'ngx-editor';
import { AuthService } from 'src/app/services/auth.service';
import { PopupService } from 'src/app/services/popup.service';
import { ReviewService } from 'src/app/services/review.service';
import { TokenService } from 'src/app/services/token.service';
import { Review } from 'src/app/types/reviewType';
import { User } from 'src/app/types/userType';

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
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(({ review }) => {
      this.review = review;
    });
    this.editor = new Editor();
    this.authService.getLoggedUser().subscribe((user: User) => {
      this.isOwner = user._id === this.review?.userId;
    });
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
