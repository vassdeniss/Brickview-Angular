import { Injectable } from '@angular/core';

@Injectable()
export class SpinnerService {
  isActive: boolean = false;

  constructor() {}

  show() {
    this.isActive = true;
  }

  hide() {
    this.isActive = false;
  }
}
