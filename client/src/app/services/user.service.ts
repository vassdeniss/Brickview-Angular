import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  editUser(formData: any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/users/edit`, formData);
  }
}
