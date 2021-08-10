import { Injectable } from '@angular/core';

import { SidebarDirective } from '../directives/sidebar.directive';

@Injectable({
  providedIn: 'root',
})
export class SidebarHelperService {
  sidenavInstances: Map<string, SidebarDirective>;

  constructor() {
    this.sidenavInstances = new Map<string, SidebarDirective>();
  }

  /**
   * 将SidebarDirective实例存储在数组中
   *
   * @param {string} id Parameter SidebarDirective实例的字符串ID
   * @param {SidebarDirective} instance Parameter SidebarDirective实例
   */
  setSidenav(id: string, instance: SidebarDirective): void {
    this.sidenavInstances.set(id, instance);
  }

  /**
   * 根据字符串ID获取SidebarDirective实例
   *
   * @param {string} id Parameter SidebarDirective实例的字符串ID
   * @returns {SidebarDirective} Return  SidebarDirective实例
   */
  getSidenav(id: string): SidebarDirective {
    return this.sidenavInstances.get(id)!;
  }
}
