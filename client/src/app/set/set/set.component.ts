import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  constructor(private setService: SetService) {}

  deleteSet(setId: string) {
    const message = this.legoSet?.review
      ? 'Are you sure you want to delete this set? This action cannot be undone and will delete the associated review.'
      : 'Are you sure you want to delete this set? This action cannot be undone.';
    if (!confirm(message)) {
      return;
    }

    this.setService.deleteSet(setId).subscribe({
      complete: () => {
        this.setRemoved.emit(setId);
      },
    });
  }
}
