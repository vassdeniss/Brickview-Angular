import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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

  constructor(
    private setService: SetService,
    private translate: TranslateService
  ) {}

  deleteSet(setId: string) {
    const neededMessage = this.legoSet?.review ? '1' : '2';

    let message;
    this.translate
      .get(`set.set.alert${neededMessage}`)
      .subscribe((res) => (message = res));

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
