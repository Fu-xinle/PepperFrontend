import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable()
export class SystemManagerAuthorizeService {
  constructor(private http: HttpClient) {}

  login(userName: string, password: string): Observable<any> {
    return this.http.post<any>('/system_manager_api/login_registration/login', {
      userName,
      password,
    });
  }

  phoneVerif(phone: string): Observable<any> {
    return this.http.post<any>('/system_manager_api/login_registration/phone_verif', {
      phone,
    });
  }

  register(userInfo: any): Observable<any> {
    return this.http.post<any>('/system_manager_api/login_registration/register', {
      userInfo,
    });
  }

  resetPassword(userGUID: string, newPassword: string): Observable<any> {
    return this.http.post<any>('/system_manager_api/personal_center/reset_password', {
      userGUID,
      newPassword,
    });
  }
}
