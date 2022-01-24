import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { IWorkflowModel, IOperatorInformationModel } from '../../shared/interface/system-manage.interface';
@Injectable()
export class WorkflowManageService {
  constructor(private http: HttpClient) {}

  /**
   *  获取所有的业务工作流信息数组
   *
   * @returns {{ workflowData: IWorkflowModel[] } } 业务工作流信息数组
   */
  getAllWorkflows(): Observable<{ workflowData: IWorkflowModel[] }> {
    return this.http.get<{ workflowData: IWorkflowModel[] }>('/system_manage_api/workflow_manage/all_workflows', {});
  }

  /**
   * 新建业务工作流，仅仅保存业务工作流的信息
   *
   * @param {IWorkflowModel} newWorkflowInfo  新建的业务工作流信息
   * @returns  {IWorkflowModel} 操作成功，返回操作者信息以及操作时间信息
   */
  addWorkflow(newWorkflowInfo: IWorkflowModel): Observable<IOperatorInformationModel> {
    return this.http.post<IOperatorInformationModel>('/system_manage_api/workflow_manage/add_workflow', {
      newWorkflowInfo,
    });
  }

  /**
   * 用户编辑业务工作流信息
   *
   * @param {IWorkflowModel} editWorkflowInfo  编辑的业务工作流信息
   * @returns  {IOperatorInformationModel} 操作成功，返回操作者信息以及操作时间信息
   */
  editWorkflow(editWorkflowInfo: IWorkflowModel): Observable<IOperatorInformationModel> {
    return this.http.post<IOperatorInformationModel>('/system_manage_api/workflow_manage/edit_workflow', {
      editWorkflowInfo,
    });
  }

  /**
   * 用户删除业务工作流信息
   *
   * @param {string} guid  业务工作流的唯一标识
   * @returns  {{}} 操作成功，返回空对象
   */
  deleteWorkflow(guid: string): Observable<{}> {
    return this.http.post<any>('/system_manage_api/workflow_manage/delete_workflow', {
      guid,
    });
  }
}
