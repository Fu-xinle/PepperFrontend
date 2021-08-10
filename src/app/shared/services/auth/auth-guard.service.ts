import { Injectable } from '@angular/core';
import { Router, UrlSegment, Route, CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['content', 'system-manager-authorize', 'login']);
      return false;
    }
  }

  canLoad(_route: Route, _segments: UrlSegment[]) {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['content', 'system-manager-authorize', 'login']);
      return false;
    }
  }
}
