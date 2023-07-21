import { PopupService } from './popup.service';

describe('PopupService', () => {
  let popupService: PopupService;

  beforeEach(() => {
    popupService = new PopupService();
  });

  it('should initialize isActive to false', () => {
    // Arrange:

    // Act:

    // Assert: isActive is false by default
    expect(popupService.isActive).toBeFalse();
  });

  it('should set isActive to true when show() is called', () => {
    // Arrange:

    // Act: show the popup
    popupService.show();

    // Assert: isActive is true when popup is shown
    expect(popupService.isActive).toBeTrue();
  });

  it('should set isActive to false when hide() is called', () => {
    // Arrange: set popup activity to true
    popupService.isActive = true;

    // Act: hide the popup
    popupService.hide();

    // Assert: isActive is false when popup is hidden
    expect(popupService.isActive).toBeFalse();
  });
});
