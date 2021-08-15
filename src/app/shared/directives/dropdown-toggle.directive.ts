import { Directive, Inject, Input, HostListener } from '@angular/core';

import { DropdownLinkDirective } from './dropdown-link.directive';

@Directive({
  selector: '[appDropdownToggle]',
})
export class DropdownToggleDirective {
  /** 三级菜单是否为当前路由，如果是对应的二级菜单dropDown设置为open状态 */
  private _open: boolean = false;

  @Input('open')
  get open(): boolean {
    return this._open;
  }

  set open(value: boolean) {
    this._open = value;
    if (value) {
      this.navlink.open = true;
    }
  }

  /**
   * 通过 @Inject 注入父级指令
   *
   * @param {DropdownLinkDirective} navlink Parameter 依赖注入父级DropdownLinkDirective指令
   */
  constructor(@Inject(DropdownLinkDirective) protected navlink: DropdownLinkDirective) {}

  /**
   * 收起展开三级菜单的事件
   *
   * @param {MouseEvent} _event Parameter click事件对象
   */
  @HostListener('click', ['$event'])
  onClick(_event: MouseEvent) {
    this.navlink.toggle();
  }
}
