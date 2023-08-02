import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MySetsComponent } from './my-sets.component';
import { ActivatedRoute } from '@angular/router';
import { PopupService } from 'src/app/services/popup.service';
import { of } from 'rxjs';

describe('MySets Component', () => {
  let component: MySetsComponent;
  let fixture: ComponentFixture<MySetsComponent>;
  let mockPopupService: jasmine.SpyObj<PopupService>;
  let mockActivatedRoute: Partial<ActivatedRoute>;

  beforeEach(() => {
    mockActivatedRoute = {
      data: of({ sets: [] }),
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

  it('dummy', () => {
    expect(true).toBe(true);
  });
});
