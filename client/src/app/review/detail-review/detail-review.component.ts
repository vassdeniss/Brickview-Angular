import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupService } from 'src/app/services/popup.service';
import { ReviewService } from 'src/app/services/review.service';
import { TokenService } from 'src/app/services/token.service';
import { Minigifure } from 'src/app/types/minifigureType';
import { Review } from 'src/app/types/reviewType';
import { Set } from 'src/app/types/setType';
import { User } from 'src/app/types/userType';

@Component({
  selector: 'app-detail-review',
  templateUrl: './detail-review.component.html',
  styleUrls: ['./detail-review.component.css'],
})
export class DetailReviewComponent implements OnInit {
  review: Review | undefined = undefined;
  set: Set | undefined = undefined;
  user: User | undefined = undefined;
  minifigures: Minigifure[] = [];
  isImageEnlarged: boolean = false;
  enlargeImageSource: string = '';
  customPopupContent: string | undefined = undefined;

  constructor(
    private reviewService: ReviewService,
    private route: ActivatedRoute,
    public popup: PopupService,
  ) {}

  ngOnInit(): void {
    this.reviewService
      .getReview(this.route.snapshot.params['id'])
      .subscribe((data) => {
        this.review = data;
        this.set = data.set as Set;
        this.user = data.user as User;
        this.minifigures = this.set.minifigs as Minigifure[];
      });
  }

  enlargeImage(image?: string): void {
    this.popup.show();
    this.enlargeImageSource = image || '';
  }
}
