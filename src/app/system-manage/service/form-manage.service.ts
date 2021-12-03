import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { IFormModel } from '../../shared/interface/system-manage.interface';
@Injectable()
export class FormManageService {
  constructor(private http: HttpClient) {}

  /**
   * 获取所有的表单信息数组
   *
   * @returns {{formData:IFormModel[]}} 表单信息数组
   */
  getAllForms(): Observable<{ formData: IFormModel[] }> {
    return this.http.get<{ formData: IFormModel[] }>('/system_manage_api/form_manage/all_forms', {});
  }

  /**
   * 用户编辑表单信息，不包括表单设计
   *
   * @param {IFormModel} editFormInfo 编辑的表单信息
   * @returns {{}} 操作成功，返回空对象
   */
  editForm(editFormInfo: IFormModel): Observable<{}> {
    return this.http.post<any>('/system_manage_api/form_manage/edit_form', {
      editFormInfo,
    });
  }

  /**
   * 用户删除表单信息，包括表单设计全部删除
   *
   * @param {string} guid  表单的唯一标识
   * @returns   {{}} 操作成功，返回空对象
   */
  deleteForm(guid: string): Observable<{}> {
    return this.http.post<{}>('/system_manage_api/form_manage/delete_form', {
      guid,
    });
  }

  // 废弃
  addForm(newFormInfo: IFormModel): Observable<{}> {
    return this.http.post<{}>('/system_manage_api/form_manage/add_form', {
      newFormInfo,
    });
  }
}
