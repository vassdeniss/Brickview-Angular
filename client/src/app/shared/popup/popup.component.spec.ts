import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupComponent } from './popup.component';

describe('PopupComponent', () => {
  it('raises the selected event when clicked', () => {
    // Arrange: configure the component for testing
    TestBed.configureTestingModule({
      declarations: [PopupComponent],
    });
    const fixture: ComponentFixture<PopupComponent> =
      TestBed.createComponent(PopupComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    // Arrange: spy on the event emitter
    spyOn(component.closed, 'emit');

    // Act: call the component method
    component.closePopup();

    // Assert: that the event emitter has been called
    expect(component.closed.emit).toHaveBeenCalled();
  });
});
