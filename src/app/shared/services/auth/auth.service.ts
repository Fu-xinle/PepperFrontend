import { Injectable } from '@angular/core';

import { IUserInformation } from '../../interface/system-manager.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = '03DE7847-A64B-4C52-959B-3581779795A0';
  private token: string | null;
  private userInfoKey = '3C59AE44-1B75-4379-AD2A-9E4CCF3DB57D';
  private userInfo: IUserInformation | null;

  constructor() {
    this.token = sessionStorage[this.tokenKey];
    this.userInfo = sessionStorage[this.userInfoKey] && JSON.parse(sessionStorage[this.userInfoKey]);
  }

  setToken(mToken: string) {
    this.token = mToken;
    sessionStorage[this.tokenKey] = mToken;
  }

  getToken(): string | null {
    return this.token || sessionStorage[this.tokenKey];
  }

  setUserInfo(mUserInfo: IUserInformation) {
    this.userInfo = mUserInfo;
    sessionStorage[this.userInfoKey] = JSON.stringify(mUserInfo);
  }

  getUserInfo(): IUserInformation | null {
    return this.userInfo || (sessionStorage[this.userInfoKey] && JSON.parse(sessionStorage[this.userInfoKey]));
  }

  logout() {
    this.token = null;
    this.userInfo = null;
    localStorage.clear();
    sessionStorage.clear();
  }

  isAuthenticated(): boolean {
    return Boolean(this.getToken() || this.getUserInfo());
  }
}
