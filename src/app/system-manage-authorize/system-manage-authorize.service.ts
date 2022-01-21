import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { IUserLoginInformation } from '../shared/interface/system-manage-authorize.interface';

@Injectable()
export class SystemManageAuthorizeService {
  constructor(private http: HttpClient) {}

  /**
   *  根据用户名和密码验证用户是否存在、密码是否正确；
   *  验证通过后，获取用户的Token、权限和角色信息
   *
   * @param {string} userName  用户名
   * @param {string} password  密码
   * @returns {IUserLoginInformation} 用户基本信息、Token、权限信息、角色信息
   */
  login(userName: string, password: string): Observable<IUserLoginInformation> {
    return this.http.post<IUserLoginInformation>('/system_manage_authorize_api/login_registration/login', {
      userName,
      password,
    });
  }

  /**
   * 用户登录系统后，弹出对话框，修改密码
   *
   * @param {string} userGuid 用户guid标识
   * @param {string} newPassword 用户新的密码
   * @returns  {{}} 操作成功，返回空对象
   */
  resetPassword(userGuid: string, newPassword: string): Observable<{}> {
    return this.http.post<{}>('/system_manage_authorize_api/login_registration/reset_password', {
      userGuid,
      newPassword,
    });
  }

  register(userInfo: any): Observable<any> {
    return this.http.post<any>('/system_manage_authorize_api/login_registration/register', {
      userInfo,
    });
  }

  phoneVerif(phone: string): Observable<any> {
    return this.http.post<any>('/system_manage_authorize_api/login_registration/phone_verif', {
      phone,
    });
  }
}
