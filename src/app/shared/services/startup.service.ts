import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { LocalStoreUtils } from '../utils/local-store.utils';
import { CustomizerService } from './customizer.service';
import { NavigationService } from './navigation.service';

/**
 * angular APP_INITIALIZER注入的服务
 * !!依据后期实际情况修改load配置函数
 */
@Injectable()
export class StartupService {
  constructor(public customizerService: CustomizerService, public navigationService: NavigationService) {}

  load(): Observable<void> {
    return new Observable<void>(subscriber => {
      /**初始化布局导航和主题 */
      this.customizerService.publishLayoutChange(LocalStoreUtils.getItem('layout'));
      this.navigationService.publishNavigationChange(LocalStoreUtils.getItem('layout'));

      /** complete */
      subscriber.complete();
    });
  }
}

/**
 * APP_INITIALIZER的工厂函数
 *
 * @param {StartupService} startupService Parameter StartupService实例
 * @returns {Observable<void>} APP_INITIALIZER的工厂函数
 */
export function StartupServiceFactory(startupService: StartupService): () => Observable<void> {
  return () => startupService.load();
}
