import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements AfterViewInit {
  @ViewChild('youTubePlayer') player!: ElementRef<HTMLDivElement>;
  @Input('videoId') videoId!: string;

  videoHeight: number | undefined;
  videoWidth: number | undefined;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.onResize();
    window.addEventListener('resize', this.onResize.bind(this));
  }

  onResize(): void {
    this.videoWidth = Math.min(this.player.nativeElement.clientWidth, 1200);
    this.videoHeight = this.videoWidth * 0.6;
    this.changeDetectorRef.detectChanges();
  }
}
