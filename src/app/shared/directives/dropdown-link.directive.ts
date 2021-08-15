import { Directive, HostBinding, Inject, Input, OnInit, OnDestroy } from '@angular/core';

import { DropdownDirective } from './dropdown.directive';

@Directive({
  selector: '[appDropdownLink]',
})
export class DropdownLinkDirective implements OnInit, OnDestroy {
  /** 链接类型,link和extLink不需考虑Dropdown */
  @Input('linkType') public linkType!: string;

  /**@HostBinding()可以为指令的宿主元素添加类、样式、属性等
   * Angular 在变更检测期间会自动检查宿主属性绑定，如果这个绑定变化了，它就会更新该指令所在的宿主元素。
   */
  protected _open: boolean = false;

  @HostBinding('class.open')
  @Input()
  get open(): boolean {
    return this._open;
  }

  set open(value: boolean) {
    this._open = value;
    if (value) {
      this.nav.closeOtherLinks(this);
    }
  }

  public constructor(@Inject(DropdownDirective) protected nav: DropdownDirective) {}

  ngOnInit() {
    if (this.linkType === 'dropDown') {
      this.nav.addLink(this);
    }
  }

  ngOnDestroy() {
    this.nav.removeLink(this);
  }

  toggle() {
    this.open = !this.open;
  }
}
