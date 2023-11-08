import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Editor } from 'ngx-editor';
import { PopupService } from 'src/app/services/popup.service';
import { ReviewService } from 'src/app/services/review.service';
import { UserService } from 'src/app/services/user.service';
import { Review } from 'src/app/types/reviewType';

let apiLoaded = false;

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
  playlist: any[] = [];
  currentIndex: number = 0;
  activeVideo: any;

  constructor(
    private reviewService: ReviewService,
    private route: ActivatedRoute,
    private routeNavigate: Router,
    public popup: PopupService,
    private userService: UserService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    if (!apiLoaded) {
      const tag = document.createElement('script');
      tag.src = `https://www.youtube.com/iframe_api`;
      document.body.appendChild(tag);
      apiLoaded = true;
    }

    this.route.data.subscribe(({ review }) => {
      this.review = review;
      this.playlist = this.review!.setVideoIds!;
      this.activeVideo = this.playlist[this.currentIndex];
    });
    this.editor = new Editor();
    this.isOwner = this.userService.user?._id === this.review?.userId;
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  previousVideo() {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = 0;
    }
    this.activeVideo = this.playlist[this.currentIndex];
  }

  nextVideo() {
    this.currentIndex++;
    if (this.currentIndex === this.playlist.length) {
      this.currentIndex--;
    }
    this.activeVideo = this.playlist[this.currentIndex];
  }

  enlargeImage(image?: string): void {
    this.popup.show();
    this.enlargeImageSource = image || '';
  }

  deleteReview(): void {
    let message;
    this.translate
      .get('review.detail-review.alert')
      .subscribe((res) => (message = res));

    if (!confirm(message)) {
      return;
    }

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
