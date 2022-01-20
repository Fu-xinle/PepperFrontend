import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable()
export class PersonalCenterService {
  constructor(private http: HttpClient) {}

  /**
   * 性别配置信息，获取性别的Select控件的选项配置信息
   *
   * @returns {{ genderOptions: Array<{ code: string; name: string }> }} 性别的配置信息
   */
  genderOption(): Observable<{ genderOptions: Array<{ code: string; name: string }> }> {
    return this.http.get<{ genderOptions: Array<{ code: string; name: string }> }>('/system_manage_api/personal_center/gender_option');
  }

  /**
   * 学位学历配置信息,获取学位学历Select控件的选项配置信息
   *
   * @returns {{ academicDegreeOptions: Array<{ code: string; name: string }> }} 学位学历配置信息数组
   */
  academicDegreeOption(): Observable<{ academicDegreeOptions: Array<{ code: string; name: string }> }> {
    return this.http.get<{ academicDegreeOptions: Array<{ code: string; name: string }> }>(
      '/system_manage_api/personal_center/academic_degree_option'
    );
  }

  /**
   * 更新用户信息各字段信息
   *
   * @param {string} userGuid 用户的唯一标识
   * @param {string}  fieldName 数据库字段名称
   * @param {string}  fieldValue 更新的字段的值
   * @returns  {{}} 操作成功，返回空对象
   */
  userInfoFieldSave(userGuid: string, fieldName: string, fieldValue: string): Observable<{}> {
    return this.http.post<{}>('/system_manage_api/personal_center/user_info_field_save', {
      userGuid,
      fieldName,
      fieldValue,
    });
  }

  /**
   * 用户信息上传照片裁切上传
   *
   * @param {string}  userGuid 用户的唯一标识
   * @param {string}  photoString 照片的string字符串表示
   * @returns {{}} 操作成功，返回空对象
   */
  updatePhoto(userGuid: string, photoString: string): Observable<{}> {
    return this.http.post<{}>('/system_manage_api/personal_center/update_photo', {
      userGuid,
      photoString,
    });
  }
}
