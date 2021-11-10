import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable()
export class LogManageService {
  constructor(private http: HttpClient) {}

  userLogServerSideData(totalCount: number | null, searchText: string, requestParams: any): Observable<any> {
    return this.http.post<any>('/system_manage_api/log_manage/user_log_server_side_data', {
      totalCount,
      searchText,
      requestParams,
    });
  }
}
