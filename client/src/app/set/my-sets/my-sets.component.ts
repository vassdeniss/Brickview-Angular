import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PopupService } from 'src/app/services/popup.service';
import { Set } from 'src/app/types/setType';

@Component({
  selector: 'app-my-sets',
  templateUrl: './my-sets.component.html',
  styleUrls: ['./my-sets.component.css'],
})
export class MySetsComponent {
  sets: Set[] = [];

  constructor(private route: ActivatedRoute, public popup: PopupService) {}

  ngOnInit(): void {
    this.route.data.subscribe(({ sets }) => {
      this.sets = sets;
      if (this.sets.length <= 0) {
        this.popup.show();
      }
    });
  }

  deleteSet(setId: string) {
    const index = this.sets.findIndex((set) => set._id === setId);
    if (index !== -1) {
      this.sets.splice(index, 1);
    }
  }
}
