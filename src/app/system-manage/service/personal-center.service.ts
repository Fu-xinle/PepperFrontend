import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable()
export class PersonalCenterService {
  constructor(private http: HttpClient) {}

  genderOption(): Observable<any> {
    return this.http.get<any>('/system_manage_api/personal_center/gender_option');
  }

  academicDegreeOption(): Observable<any> {
    return this.http.get<any>('/system_manage_api/personal_center/academic_degree_option');
  }

  userInfoFieldSave(userGuid: string, fieldName: string, fieldValue: string): Observable<any> {
    return this.http.post<any>('/system_manage_api/personal_center/user_info_field_save', {
      userGuid,
      fieldName,
      fieldValue,
    });
  }

  updatePhoto(userGuid: string, photoString: string): Observable<any> {
    return this.http.post<any>('/system_manage_api/personal_center/update_photo', {
      userGuid,
      photoString,
    });
  }
}
