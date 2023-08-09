import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSetsComponent } from './user-sets.component';

describe('UserSetsComponent', () => {
  let component: UserSetsComponent;
  let fixture: ComponentFixture<UserSetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserSetsComponent]
    });
    fixture = TestBed.createComponent(UserSetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
