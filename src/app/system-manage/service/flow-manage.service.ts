import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { IFlowModel, IFlowNode } from '../../shared/interface/system-manage.interface';

@Injectable()
export class FlowManageService {
  constructor(private http: HttpClient) {}

  /**
   * 获取流程数据数组，在表格中显示，不包含流程图JSON数据
   *
   * @returns {{ flowData: IFlowModel[] }} 流程数据数组
   */
  getAllFlows(): Observable<{ flowData: IFlowModel[] }> {
    return this.http.get<{ flowData: IFlowModel[] }>('/system_manage_api/flow_manage/all_flows', {});
  }

  /**
   * 用户编辑流程信息，不包括设计流程图
   *
   * @param {IFlowModel} editFlowInfo  编辑的流程信息
   * @returns {{}} 操作成功，返回空对象
   */
  editFlow(editFlowInfo: IFlowModel): Observable<{}> {
    return this.http.post<{}>('/system_manage_api/flow_manage/edit_flow', {
      editFlowInfo,
    });
  }

  /**
   * 用户删除流程信息，包括流程图全部删除
   *
   * @param   { string } guid 流程guid 唯一标识
   * @returns {{}} 操作成功，返回空对象
   */
  deleteFlow(guid: string): Observable<{}> {
    return this.http.post<{}>('/system_manage_api/flow_manage/delete_flow', {
      guid,
    });
  }

  /**
   * 新建流程以及流程另存为操作，包含保存流程图
   *
   * @param {IFlowModel} flowInfo 流程信息
   * @param {IFlowNode[]} nodes  流程解析后节点对应关系信息
   * @param {string} diagramJson  流程图json表示
   * @returns {{}}  操作成功，返回空对象
   */
  newAndSaveAsFlow(flowInfo: IFlowModel, nodes: IFlowNode[], diagramJson: string): Observable<{}> {
    return this.http.post<{}>('/system_manage_api/flow_manage/new_and_save_flow', {
      flowInfo,
      nodes,
      diagramJson,
    });
  }

  /**
   * 根据 guid 获取流程图信息
   *
   * @param {string} guid 流程的唯一标识
   * @returns {{ diagramJson: string }}  流程图json表示
   */
  getFlowDiagram(guid: string): Observable<{ diagramJson: string }> {
    return this.http.post<{ diagramJson: string }>('/system_manage_api/flow_manage/flow_diagram', {
      guid,
    });
  }

  /**
   * 流程保存操作，包含保存流程图
   *
   * @param {string} guid 流程的唯一标识
   * @param {IFlowNode[]} nodes  流程解析后节点对应关系信息
   * @param {string} diagramJson  流程图json表示
   * @returns {{}}  操作成功，返回空对象
   */
  saveFlowDiagram(guid: string, nodes: IFlowNode[], diagramJson: string): Observable<{}> {
    return this.http.post<{}>('/system_manage_api/flow_manage/save_flow_diagram', {
      guid,
      nodes,
      diagramJson,
    });
  }
}
