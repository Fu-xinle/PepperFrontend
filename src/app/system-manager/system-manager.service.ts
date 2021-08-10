import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable()
export class SystemManagerService {
  constructor(private http: HttpClient) {}

  genderOption(): Observable<any> {
    return this.http.get<any>('/system_manager_api/personal_center/gender_option');
  }

  academicDegreeOption(): Observable<any> {
    return this.http.get<any>('/system_manager_api/personal_center/academic_degree_option');
  }

  userInfoFieldSave(userGUID: string, fieldName: string, fieldValue: string): Observable<any> {
    return this.http.post<any>('/system_manager_api/personal_center/user_info_field_save', {
      userGUID,
      fieldName,
      fieldValue,
    });
  }

  updatePhoto(userGUID: string, photoString: string): Observable<any> {
    return this.http.post<any>('/system_manager_api/personal_center/update_photo', {
      userGUID,
      photoString,
    });
  }

  getAllFlows(): Observable<any> {
    return this.http.get<any>('/system_manager_api/flow_manager/all_flows', {});
  }

  addFlow(newFlowInfo: any): Observable<any> {
    return this.http.post<any>('/system_manager_api/flow_manager/add_flow', {
      newFlowInfo,
    });
  }

  editFlow(editFlowInfo: any): Observable<any> {
    return this.http.post<any>('/system_manager_api/flow_manager/edit_flow', {
      editFlowInfo,
    });
  }

  deleteFlow(guid: string): Observable<any> {
    return this.http.post<any>('/system_manager_api/flow_manager/delete_flow', {
      guid,
    });
  }

  getAllForms(): Observable<any> {
    return this.http.get<any>('/system_manager_api/form_manager/all_forms', {});
  }

  addForm(newFormInfo: any): Observable<any> {
    return this.http.post<any>('/system_manager_api/form_manager/add_form', {
      newFormInfo,
    });
  }

  editForm(editFormInfo: any): Observable<any> {
    return this.http.post<any>('/system_manager_api/form_manager/edit_form', {
      editFormInfo,
    });
  }

  deleteForm(guid: string): Observable<any> {
    return this.http.post<any>('/system_manager_api/form_manager/delete_form', {
      guid,
    });
  }

  getAllAlgorithms(): Observable<any> {
    return this.http.get<any>('/system_manager_api/geoprocessing_model/all_algorithms', {});
  }

  addAlgorithm(newAlgorithmInfo: any): Observable<any> {
    return this.http.post<any>('/system_manager_api/geoprocessing_model/add_algorithm', {
      newAlgorithmInfo,
    });
  }

  editAlgorithm(editAlgorithmInfo: any): Observable<any> {
    return this.http.post<any>('/system_manager_api/geoprocessing_model/edit_algorithm', {
      editAlgorithmInfo,
    });
  }

  deleteAlgorithm(guid: string): Observable<any> {
    return this.http.post<any>('/system_manager_api/geoprocessing_model/delete_algorithm', {
      guid,
    });
  }

  userLogServerSideData(totalCount: number, searchText: string, requestParams: any): Observable<any> {
    return this.http.post<any>('/system_manager_api/log_manager/user_log_server_side_data', {
      totalCount,
      searchText,
      requestParams,
    });
  }
}
