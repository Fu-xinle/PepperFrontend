import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable()
export class FormManageService {
  constructor(private http: HttpClient) {}

  getAllForms(): Observable<any> {
    return this.http.get<any>('/system_manage_api/form_manage/all_forms', {});
  }

  addForm(newFormInfo: any): Observable<any> {
    return this.http.post<any>('/system_manage_api/form_manage/add_form', {
      newFormInfo,
    });
  }

  editForm(editFormInfo: any): Observable<any> {
    return this.http.post<any>('/system_manage_api/form_manage/edit_form', {
      editFormInfo,
    });
  }

  deleteForm(guid: string): Observable<any> {
    return this.http.post<any>('/system_manage_api/form_manage/delete_form', {
      guid,
    });
  }
}
