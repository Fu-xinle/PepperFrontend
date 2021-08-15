import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventListenerService {
  /**用户信息中上传新的用户照片,Header组件中的照片也立即修改 */
  public changePhotoAnnouncedSource = new Subject<void>();
  public changePhotoAnnounced$ = this.changePhotoAnnouncedSource.asObservable();

  constructor() {}

  changePhoto() {
    this.changePhotoAnnouncedSource.next();
  }
}
