import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';

import { AppSetting } from '../../../../app.settings';
import { AuthService } from '../../../shared/services/auth/auth.service';

@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private injector: Injector) {
    /**HttpInterceptor拦截器并不拦截独立的ajax,jquery的ajax单独拦截 */
    $.ajaxSetup({
      contentType: 'application/json',
      beforeSend: (jqXHR, settings) => {
        let url = settings.url!;
        if (!url.startsWith('https://') && !url.startsWith('http://')) {
          url = AppSetting.backendUrl + url;
        }
        jqXHR.setRequestHeader('authorization', `Pepper ${this.authService.getToken()}`);
        settings.url = url;
      },
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    /**对所有请求统一加上服务端前缀、headers以及Token */
    let url = req.url!;
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      url = AppSetting.backendUrl + url;
    }
    const authReq = req.clone({
      url,
      setHeaders: {
        contentType: 'application/json',
        authorization: `Pepper ${this.authService.getToken()}`,
      },
    });
    return next.handle(authReq);
  }
}
