import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SetService } from 'src/app/services/set.service';
import { Set } from 'src/app/types/setType';

@Component({
  selector: 'app-set',
  templateUrl: './set.component.html',
  styleUrls: ['./set.component.css'],
})
export class SetComponent {
  @Input() legoSet: Set | undefined = undefined;
  @Output() setRemoved = new EventEmitter<string>();

  constructor(private setService: SetService, private router: Router) {}

  deleteSet(setId: string) {
    this.setService.deleteSet(setId).subscribe({
      complete: () => {
        this.setRemoved.emit(setId);
      },
    });
  }
}
