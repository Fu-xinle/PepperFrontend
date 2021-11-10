import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable()
export class FlowManageService {
  constructor(private http: HttpClient) {}

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
}
