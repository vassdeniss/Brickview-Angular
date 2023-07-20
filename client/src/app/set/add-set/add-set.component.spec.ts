import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AddSetComponent } from './add-set.component';
import { PopupService } from '../../services/popup.service';
import { SetService } from '../../services/set.service';
import { Router } from '@angular/router';

describe('AddSetComponent', () => {
  let component: AddSetComponent;
  let fixture: ComponentFixture<AddSetComponent>;
  let mockRouter: any;
  let mockPopupService: jasmine.SpyObj<PopupService>;
  let mockSetService: jasmine.SpyObj<SetService>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockPopupService = jasmine.createSpyObj('PopupService', ['show']);
    mockSetService = jasmine.createSpyObj('SetService', ['addSet']);

    TestBed.configureTestingModule({
      declarations: [AddSetComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: PopupService, useValue: mockPopupService },
        { provide: SetService, useValue: mockSetService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display validation errors and show popup when form is invalid', () => {
    // Arrange: set invalid fields
    const button = {} as HTMLButtonElement;

    // Act: call the onSubmit method with a fake button element
    component.onSubmit(button);

    // Assert: that there are errors and the popup is shown
    expect(component.errors).toContain('setId is required!');
    expect(mockPopupService.show).toHaveBeenCalled();
    expect(button.disabled).toBe(false);
  });

  it('should call SetService.addSet and navigate to "sets/my-sets" when form is valid', () => {
    // Arrange: set form values, spies
    const button = {} as HTMLButtonElement;
    spyOnProperty(component.setForm, 'invalid').and.returnValue(false);
    component.setForm.get('setId')?.setValue('123');
    mockSetService.addSet.and.returnValue(of({}));

    // Act: call the onSubmit method with a fake button element
    component.onSubmit(button);

    // Assert: that the SetService.addSet method was called with the correct values
    expect(button.disabled).toBe(true);
    expect(mockSetService.addSet).toHaveBeenCalledWith('123');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sets/my-sets']);
  });

  it('should display error message and show popup when submission fails', () => {
    // Arrange: set form values, spies
    const button = {} as HTMLButtonElement;
    const errorMessage = 'Error occurred during set addition';
    mockSetService.addSet.and.returnValue(
      throwError(() => {
        return { error: { message: errorMessage } };
      })
    );
    component.setForm.get('setId')?.setValue('123');

    // Act: call the onSubmit method with a fake button element
    component.onSubmit(button);

    // Assert: that an error message is displayed in the popup
    expect(component.errors).toEqual([errorMessage]);
    expect(mockPopupService.show).toHaveBeenCalled();
    expect(button.disabled).toBe(false);
  });
});
