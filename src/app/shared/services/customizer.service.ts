import { Injectable } from '@angular/core';

import { ICustomizerLayout, ICustomizerTheme } from '../interface/shared-layout.interface';
import { NavigationService } from '../services/navigation.service';

@Injectable({
  providedIn: 'root',
})
export class CustomizerService {
  public layouts: ICustomizerLayout[] = [
    {
      title: '门户网站',
      name: 'portal',
      img: 'assets/images/customizer/layout-portal.png',
    },
    {
      title: '开发测试系统',
      name: 'development',
      img: 'assets/images/customizer/layout-development.png',
    },
    {
      title: '自然资源审计系统',
      name: 'audit',
      img: 'assets/images/customizer/layout-audit.png',
    },
    {
      title: '国土空间规划系统',
      name: 'spatial-planning',
      img: 'assets/images/customizer/layout-spatial-planning.png',
    },
    {
      title: '深度学习系统',
      name: 'deep-learning',
      img: 'assets/images/customizer/layout-deep-learning.png',
    },
    {
      title: '信息化测绘生产管理系统',
      name: 'productOA',
      img: 'assets/images/customizer/layout-productOA.png',
    },
    {
      title: '督察成果管理系统',
      name: 'supervision',
      img: 'assets/images/customizer/layout-supervision.png',
    },
  ];
  public selectedLayout!: ICustomizerLayout;

  public colors: ICustomizerTheme[] = [
    {
      sidebarClass: 'sidebar-gradient-purple-indigo',
      class: 'gradient-purple-indigo',
      active: false,
    },
    {
      sidebarClass: 'sidebar-gradient-black-blue',
      class: 'gradient-black-blue',
      active: false,
    },
    {
      sidebarClass: 'sidebar-gradient-black-gray',
      class: 'gradient-black-gray',
      active: false,
    },
    {
      sidebarClass: 'sidebar-gradient-steel-gray',
      class: 'gradient-steel-gray',
      active: false,
    },

    {
      sidebarClass: 'sidebar-dark-purple',
      class: 'dark-purple',
      active: true,
    },
    {
      sidebarClass: 'sidebar-slate-gray',
      class: 'slate-gray',
      active: false,
    },
    {
      sidebarClass: 'sidebar-midnight-blue',
      class: 'midnight-blue',
      active: false,
    },
    {
      sidebarClass: 'sidebar-blue',
      class: 'blue',
      active: false,
    },
    {
      sidebarClass: 'sidebar-indigo',
      class: 'indigo',
      active: false,
    },
    {
      sidebarClass: 'sidebar-pink',
      class: 'pink',
      active: false,
    },
    {
      sidebarClass: 'sidebar-red',
      class: 'red',
      active: false,
    },
    {
      sidebarClass: 'sidebar-purple',
      class: 'purple',
      active: false,
    },
  ];
  public selectedSidebarColor!: ICustomizerTheme;

  constructor(public navService: NavigationService) {}

  /**
   * 更改布局,同时更改主题颜色，通过body元素添加和移除类实现
   *
   * @param {string | null} layoutname Parameter 布局类型名称
   */
  publishLayoutChange(layoutname: string | null) {
    layoutname = layoutname ? layoutname : 'development';
    this.layouts.some(element => {
      if (element.name === layoutname) {
        this.selectedLayout = element;
        /** //?? 布局更改，同时变更主题(颜色、圆角、字体、空白、dark/light等) */
        this.changeTheme(this.layouts, layoutname);
        return true;
      }
      return false;
    });
  }

  /**
   * html元素移除的特定class类
   *
   * @param {HTMLElement | HTMLElement[] | null} el Parameter  html元素或者元素数组
   * @param {string} className Parameter html元素移除的class类名称
   */
  removeClass(el: HTMLElement | HTMLElement[] | null, className: string) {
    if (!el || (el as HTMLElement[]).length === 0) return;
    if (!el.hasOwnProperty('length')) {
      el = el as HTMLElement;
      el.classList.remove(className);
    } else {
      el = el as HTMLElement[];
      for (var i = 0; i < el.length; i++) {
        el[i].classList.remove(className);
      }
    }
  }

  /**
   * html元素添加的特定class类
   *
   * @param  {HTMLElement | HTMLElement[] | null} el Parameter  html元素或者元素数组
   * @param {string} className Parameter html元素添加的class类名称
   */
  addClass(el: HTMLElement | HTMLElement[] | null, className: string) {
    if (!el || (el as HTMLElement[]).length === 0) return;
    if (!el.hasOwnProperty('length')) {
      el = el as HTMLElement;
      el.classList.add(className);
    } else {
      el = el as HTMLElement[];
      for (var i = 0; i < el.length; i++) {
        el[i].classList.add(className);
      }
    }
  }

  /**
   * 寻找最近的包含class类名的父元素
   *
   * @param {HTMLElement | null} el Parameter html元素
   * @param {string} className Parameter class类名字符串
   * @returns {HTMLElement | undefined} Return 最近的包含class类名的父元素
   */
  findClosest(el: HTMLElement | null, className: string) {
    if (!el) return;
    while (el) {
      var parent: HTMLElement | null = el.parentElement;
      if (parent && this.hasClass(parent, className)) {
        return parent;
      }
      el = parent;
    }
    return;
  }

  /**
   * 判断html元素是否包含class类
   *
   * @param {HTMLElement} el Parameter html元素
   * @param {string} className Parameter 类名字符串
   * @returns {boolean | undefined} Return html元素是否包含class类
   */
  hasClass(el: HTMLElement, className: string) {
    if (!el) return;
    return ` ${el.className} `.replace(/[\n\t]/g, ' ').indexOf(` ${className} `) > -1;
  }

  /**
   * html元素切换class类
   *
   * @param {HTMLElement} el Parameter html元素
   * @param {string} className Parameter class类名字符串
   */
  toggleClass(el: HTMLElement, className: string) {
    if (!el) return;
    if (this.hasClass(el, className)) {
      this.removeClass(el, className);
    } else {
      this.addClass(el, className);
    }
  }

  /**
   * 将目前已有的主题移除，切换到新主题
   *
   * @param {ICustomizerLayout[]} themes Parameter 目前已有的主题
   * @param {string} themeName Parameter 目标主题的名称即布局名称
   */
  changeTheme(themes: ICustomizerLayout[], themeName: string) {
    themes.forEach(theme => {
      this.removeClass(document.body, `scrsnb-${theme.name}`);
    });
    this.addClass(document.body, `scrsnb-${themeName}`);
  }
}
