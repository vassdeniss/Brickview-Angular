import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { PopupService } from 'src/app/services/popup.service';
import { MySetsComponent } from './my-sets.component';
import { Set } from 'src/app/types/setType';
import { of } from 'rxjs';

describe('MySets Component', () => {
  let component: MySetsComponent;
  let fixture: ComponentFixture<MySetsComponent>;
  let mockActivatedRoute: any;
  let mockPopupService: any;
  let mockSet: Set;

  beforeEach(() => {
    mockSet = {
      _id: 'mock_id',
      setNum: '12345',
      name: 'Mock Set',
      year: 2023,
      parts: 500,
      image: 'mock_image.jpg',
      minifigCount: 4,
      minifigs: [],
      userImage: 'user_mock_image.jpg',
      username: 'mock_user',
      review: 'This is a mock review.',
    };
    mockActivatedRoute = {
      data: of({
        sets: [],
      }),
    };
    mockPopupService = jasmine.createSpyObj('PopupService', ['show']);

    TestBed.configureTestingModule({
      declarations: [MySetsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: PopupService, useValue: mockPopupService },
      ],
    });

    fixture = TestBed.createComponent(MySetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should delete a set if it exists', () => {
    // Arrange
    const setId = 'mock_id';
    component.sets = [mockSet];

    // Act: call the deleteSet method
    component.deleteSet(setId);

    // Assert: check that the set was deleted
    expect(component.sets).not.toContain(mockSet);
  });

  it('should not delete anything if the set does not exist', () => {
    // Arrange: set up a non-existent set ID
    const setId = 'non_existent_id';
    const initialSets = [...component.sets];

    // Act: call the deleteSet method
    component.deleteSet(setId);

    // Assert: check that the sets array is unchanged
    expect(component.sets).toEqual(initialSets);
  });
});
