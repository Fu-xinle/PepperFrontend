import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { IGeoprocessingModel, IOperatorInformationModel } from '../../shared/interface/system-manage.interface';

@Injectable()
export class KanBanService {
  constructor(private http: HttpClient) {}

  /**
   *  获取所有的地理处理模型信息数组
   *
   * @returns {{ geoprocessingModelData: IGeoprocessingModel[] } } 地理处理模型信息数组
   */
  getAllGeoprocessingModels(): Observable<{ geoprocessingModelData: IGeoprocessingModel[] }> {
    return this.http.get<{ geoprocessingModelData: IGeoprocessingModel[] }>(
      '/system_manage_api/geoprocessing_model/all_geoprocessing_model',
      {}
    );
  }

  /**
   * 新建地理处理模型，仅仅保存地理处理模型的信息，不包含地理处理模型设计图
   *
   * @param {IGeoprocessingModel} newGeoprocessingModelInfo  新建的地理处理模型信息
   * @returns  {IOperatorInformationModel} 操作成功，返回操作者信息以及操作时间信息
   */
  addGeoprocessingModel(newGeoprocessingModelInfo: IGeoprocessingModel): Observable<IOperatorInformationModel> {
    return this.http.post<IOperatorInformationModel>('/system_manage_api/geoprocessing_model/add_geoprocessing_model', {
      newGeoprocessingModelInfo,
    });
  }

  /**
   * 用户编辑地理处理模型信息，不包括地理处理模型设计
   *
   * @param {IGeoprocessingModel} editGeoprocessingModelInfo  编辑的地理处理模型信息
   * @returns  {IOperatorInformationModel} 操作成功，返回操作者信息以及操作时间信息
   */
  editGeoprocessingModel(editGeoprocessingModelInfo: IGeoprocessingModel): Observable<IOperatorInformationModel> {
    return this.http.post<IOperatorInformationModel>('/system_manage_api/geoprocessing_model/edit_geoprocessing_model', {
      editGeoprocessingModelInfo,
    });
  }

  /**
   * 用户删除地理处理模型信息，包括地理处理模型设计，全部删除
   *
   * @param {string} guid  地理处理模型的唯一标识
   * @returns  {{}} 操作成功，返回空对象
   */
  deleteGeoprocessingModel(guid: string): Observable<{}> {
    return this.http.post<any>('/system_manage_api/geoprocessing_model/delete_geoprocessing_model', {
      guid,
    });
  }
}
