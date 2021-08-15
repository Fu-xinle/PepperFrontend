import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable()
export class SystemManageService {
  constructor(private http: HttpClient) {}

  genderOption(): Observable<any> {
    return this.http.get<any>('/system_manage_api/personal_center/gender_option');
  }

  academicDegreeOption(): Observable<any> {
    return this.http.get<any>('/system_manage_api/personal_center/academic_degree_option');
  }

  userInfoFieldSave(userGUID: string, fieldName: string, fieldValue: string): Observable<any> {
    return this.http.post<any>('/system_manage_api/personal_center/user_info_field_save', {
      userGUID,
      fieldName,
      fieldValue,
    });
  }

  updatePhoto(userGUID: string, photoString: string): Observable<any> {
    return this.http.post<any>('/system_manage_api/personal_center/update_photo', {
      userGUID,
      photoString,
    });
  }

  getAllFlows(): Observable<any> {
    return this.http.get<any>('/system_manage_api/flow_manage/all_flows', {});
  }

  addFlow(newFlowInfo: any): Observable<any> {
    return this.http.post<any>('/system_manage_api/flow_manage/add_flow', {
      newFlowInfo,
    });
  }

  editFlow(editFlowInfo: any): Observable<any> {
    return this.http.post<any>('/system_manage_api/flow_manage/edit_flow', {
      editFlowInfo,
    });
  }

  deleteFlow(guid: string): Observable<any> {
    return this.http.post<any>('/system_manage_api/flow_manage/delete_flow', {
      guid,
    });
  }

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

  getAllGeoprocessingModels(): Observable<any> {
    return this.http.get<any>('/system_manage_api/geoprocessing_model/all_geoprocessing_model', {});
  }

  addGeoprocessingModel(newGeoprocessingModelInfo: any): Observable<any> {
    return this.http.post<any>('/system_manage_api/geoprocessing_model/add_geoprocessing_model', {
      newGeoprocessingModelInfo,
    });
  }

  editGeoprocessingModel(editGeoprocessingModelInfo: any): Observable<any> {
    return this.http.post<any>('/system_manage_api/geoprocessing_model/edit_geoprocessing_model', {
      editGeoprocessingModelInfo,
    });
  }

  deleteGeoprocessingModel(guid: string): Observable<any> {
    return this.http.post<any>('/system_manage_api/geoprocessing_model/delete_geoprocessing_model', {
      guid,
    });
  }

  userLogServerSideData(totalCount: number | null, searchText: string, requestParams: any): Observable<any> {
    return this.http.post<any>('/system_manage_api/log_manage/user_log_server_side_data', {
      totalCount,
      searchText,
      requestParams,
    });
  }
}
