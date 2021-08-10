import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventListenerService {
  // Observable string sources
  public changePhotoAnnouncedSource = new Subject<void>();

  // Observable string streams
  public changePhotoAnnounced$ = this.changePhotoAnnouncedSource.asObservable();

  constructor() {}

  // Service message commands
  changePhoto() {
    this.changePhotoAnnouncedSource.next();
  }
}
