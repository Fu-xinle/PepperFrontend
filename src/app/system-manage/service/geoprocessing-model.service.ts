import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable()
export class GeoprocessingModelService {
  constructor(private http: HttpClient) {}

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
}
