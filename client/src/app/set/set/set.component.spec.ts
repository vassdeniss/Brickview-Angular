import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SetService } from 'src/app/services/set.service';
import { SetComponent } from './set.component';

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

  it('dummy', () => {
    expect(true).toBe(true);
  });
});
