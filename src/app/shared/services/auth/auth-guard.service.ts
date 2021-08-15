import { Injectable } from '@angular/core';
import { Router, UrlSegment, Route, CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * 路由守卫,若用户未授权验证,路由到登录页面,用于防止未经授权的用户访问某些路由
   * 路由模块将被加载，即使用户无法访问该路由。
   *
   * @param {ActivatedRouteSnapshot} _route Parameter
   * @param {RouterStateSnapshot} _state Parameter
   * @returns {boolean} Return 指定路由是否可以访问
   */
  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['content', 'system-manage-authorize', 'login']);
      return false;
    }
  }

  /**
   * 路由守卫,用于防止应用程序在用户未经授权的情况下延迟加载整个模块。
   * 若用户未通过授权验证，模块不会加载.
   *
   * @param {Route} _route  Parameter
   * @param {UrlSegment} _segments  Parameter
   * @returns {boolean} Return 指定路由是否加载
   */
  canLoad(_route: Route, _segments: UrlSegment[]) {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['content', 'system-manage-authorize', 'login']);
      return false;
    }
  }
}
