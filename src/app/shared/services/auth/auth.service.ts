import { Injectable } from '@angular/core';

import { IUserInformation } from '../../interface/system-manage.interface';

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

  /**
   * 用户Token令牌存储在浏览器内存中（sessionStorage）
   *
   * @param {string} mToken Parameter 用户Token令牌字符串
   */
  setToken(mToken: string) {
    this.token = mToken;
    sessionStorage[this.tokenKey] = mToken;
  }

  /**
   * 存储在浏览器内存中的用户Token令牌
   *
   * @returns {string | null} Return 当前用户Token令牌
   */
  getToken(): string | null {
    return this.token || sessionStorage[this.tokenKey] || null;
  }

  /**
   * 当前用户信息对象存储在浏览器内存中（sessionStorage）
   *
   * @param {IUserInformation} mUserInfo Parameter 当前用户信息对象
   */
  setUserInfo(mUserInfo: IUserInformation) {
    this.userInfo = mUserInfo;
    sessionStorage[this.userInfoKey] = JSON.stringify(mUserInfo);
  }

  /**
   * 存储在浏览器内存中的用户信息
   *
   * @returns {IUserInformation | null} Return 当前用户信息对象
   */
  getUserInfo(): IUserInformation | null {
    return this.userInfo || (sessionStorage[this.userInfoKey] && JSON.parse(sessionStorage[this.userInfoKey])) || null;
  }

  /**
   * 用户注销,将Token令牌和用户信息清空,清空localStorage和sessionStorage
   */
  logout() {
    this.token = null;
    this.userInfo = null;
    localStorage.clear();
    sessionStorage.clear();
  }

  /**
   * 用户是否验证授权,若存在Token令牌或用户信息，则验证授权
   *
   * @returns {boolean} Return 用户是否验证授权
   */
  isAuthenticated(): boolean {
    return Boolean(this.getToken() || this.getUserInfo());
  }
}
