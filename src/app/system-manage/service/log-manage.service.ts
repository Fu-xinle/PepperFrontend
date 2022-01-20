import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IServerSideGetRowsRequest } from 'ag-grid-community';
import { Observable } from 'rxjs';

import { IUserLog } from '../../shared/interface/system-manage.interface';

@Injectable()
export class LogManageService {
  constructor(private http: HttpClient) {}

  /**
   * 利用ag-grid 分页显示用户日志数据
   *
   * @param {number | null} totalCount 记录总数
   * @param {string} searchText 搜索文本
   * @param {IServerSideGetRowsRequest} requestParams ag-grid 分页参数
   * @returns {{ rowCount: number; rowData: IUserLog[] }} 用户的日志分页记录数据
   */
  userLogServerSideData(
    totalCount: number | null,
    searchText: string,
    requestParams: IServerSideGetRowsRequest
  ): Observable<{ rowCount: number; rowData: IUserLog[] }> {
    return this.http.post<{ rowCount: number; rowData: IUserLog[] }>('/system_manage_api/log_manage/user_log_server_side_data', {
      totalCount,
      searchText,
      requestParams,
    });
  }
}
