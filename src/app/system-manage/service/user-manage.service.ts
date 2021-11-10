import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable()
export class UserManageService {
  constructor(private http: HttpClient) {}

  genderOption(): Observable<any> {
    return this.http.get<any>('/system_manage_api/personal_center/gender_option');
  }
}
