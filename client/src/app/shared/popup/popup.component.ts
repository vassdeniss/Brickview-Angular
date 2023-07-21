import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
})
export class PopupComponent {
  @Input() title: string = '';
  @Output() closed = new EventEmitter();

  closePopup(): void {
    this.closed.emit();
  }
}
