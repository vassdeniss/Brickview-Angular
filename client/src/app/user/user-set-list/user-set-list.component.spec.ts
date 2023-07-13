// TODO: Fix tests

// import { TestBed } from '@angular/core/testing';
// import { Observable, of } from 'rxjs';

// import { UserSetListComponent } from './user-set-list.component';
// import { SetService } from 'src/app/services/set.service';
// import { Set } from 'src/app/types/setType';

// const mockLegoSet: Set = {
//   setNum: '12345',
//   name: 'Mock Set',
//   year: 2023,
//   parts: 500,
//   image: 'mock-image-url',
//   minifigCount: 10,
// };

// class SetServiceMock {
//   getSet(): Observable<Set> {
//     return of(mockLegoSet);
//   }
// }

// describe('UserSetListComponent', () => {
//   let component: UserSetListComponent;
//   let setService: SetService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [
//         UserSetListComponent,
//         {
//           provide: SetService,
//           useClass: SetServiceMock,
//         },
//       ],
//     });

//     component = TestBed.inject(UserSetListComponent);
//     setService = TestBed.inject(SetService);
//   });

//   it('should populate sets array with data from service', () => {
//     component.ngOnInit();
//     expect(component.sets).toContain(mockLegoSet);
//   });
// });
