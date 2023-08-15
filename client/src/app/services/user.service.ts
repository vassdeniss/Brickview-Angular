import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../types/userType';
import {
  LoginCredentials,
  RegisterCredentials,
} from '../types/credentialsType';
import { AuthData } from '../types/authType';

@Injectable()
export class UserService implements OnDestroy {
  private user$$ = new BehaviorSubject<User | undefined>(undefined);
  private user$ = this.user$$.asObservable();
  user: User | undefined = undefined;
  userSubscription!: Subscription;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user$$.next(JSON.parse(storedUser));
    }

    this.userSubscription = this.user$.subscribe((user) => {
      this.user = user;
    });
  }

  register(credentials: RegisterCredentials): Observable<AuthData> {
    return this.http.post<AuthData>(
      `${environment.apiUrl}/users/register`,
      credentials
    );
  }

  login(credentials: LoginCredentials): Observable<AuthData> {
    return this.http.post<AuthData>(
      `${environment.apiUrl}/users/login`,
      credentials
    );
  }

  logout(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/logout`).pipe(
      tap(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('image');
        this.user$$.next(undefined);
      })
    );
  }

  editUser(formData: any): Observable<User> {
    return this.http.patch<User>(`${environment.apiUrl}/users/edit`, formData);
  }

  get isAuthenticated(): boolean {
    return !!this.user;
  }

  updateUser(user: User) {
    this.user$$.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
