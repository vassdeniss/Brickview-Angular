import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SetService } from 'src/app/services/set.service';
import { SetComponent } from './set.component';
import { of } from 'rxjs';

describe('Set Component', () => {
  let component: SetComponent;
  let fixture: ComponentFixture<SetComponent>;
  let mockSetService: jasmine.SpyObj<SetService>;

  beforeEach(() => {
    mockSetService = jasmine.createSpyObj('SetService', ['deleteSet']);

    TestBed.configureTestingModule({
      declarations: [SetComponent],
      providers: [{ provide: SetService, useValue: mockSetService }],
    });

    fixture = TestBed.createComponent(SetComponent);
    component = fixture.componentInstance;
  });

  it('should emit setRemoved event when deleteSet is called', () => {
    // Arrange: set up a mock set id and mock set service
    const setId = '123';
    mockSetService.deleteSet.and.returnValue(of(null));
    spyOn(component.setRemoved, 'emit');

    spyOn(window, 'confirm').and.returnValue(true);

    // Act: call the deleteSet method
    component.deleteSet(setId);

    // Assert: check that the setRemoved event was emitted
    expect(mockSetService.deleteSet).toHaveBeenCalledWith(setId);
    expect(component.setRemoved.emit).toHaveBeenCalledWith(setId);
  });
});
