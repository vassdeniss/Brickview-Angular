import { SpinnerService } from './spinner.service';

describe('SpinnerService', () => {
  let spinnerService: SpinnerService;

  beforeEach(() => {
    spinnerService = new SpinnerService();
  });

  it('should initialize isActive to false', () => {
    // Arrange:

    // Act:

    // Assert: isActive is false by default
    expect(spinnerService.isActive).toBeFalse();
  });

  it('should set isActive to true when show() is called', () => {
    // Arrange:

    // Act: show the spinner
    spinnerService.show();

    // Assert: isActive is true when spinner is shown
    expect(spinnerService.isActive).toBeTrue();
  });

  it('should set isActive to false when hide() is called', () => {
    // Arrange: set spinner activity to true
    spinnerService.isActive = true;

    // Act: hide the spinner
    spinnerService.hide();

    // Assert: isActive is false when spinner is hidden
    expect(spinnerService.isActive).toBeFalse();
  });
});
