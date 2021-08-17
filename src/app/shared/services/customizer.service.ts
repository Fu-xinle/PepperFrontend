import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ICustomizerLayout, ICustomizerTheme } from '../interface/shared-layout.interface';
import { LocalStoreService } from '../services/local-store.service';
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

  constructor(private router: Router, public localStoreService: LocalStoreService, public navService: NavigationService) {
    /** 初始化布局 */
    this.publishLayoutChange(this.localStoreService.getItem('layout'));
  }

  publishLayoutChange(layoutname: string | null) {
    layoutname = layoutname ? layoutname : 'development';
    this.layouts.some(element => {
      if (element.name === layoutname) {
        this.selectedLayout = element;
        /** //!! 布局更改，同时变更主题(颜色、圆角、字体、空白、dark/light等) */
        return true;
      }
      return false;
    });
  }

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

  hasClass(el: HTMLElement, className: string) {
    if (!el) return;
    return ` ${el.className} `.replace(/[\n\t]/g, ' ').indexOf(` ${className} `) > -1;
  }

  toggleClass(el: HTMLElement, className: string) {
    if (!el) return;
    if (this.hasClass(el, className)) {
      this.removeClass(el, className);
    } else {
      this.addClass(el, className);
    }
  }

  //   changeTheme(themes: any[], themeName: string) {
  //     themes.forEach(theme => {
  //       this.removeClass(document.body, theme.name);
  //     });
  //     this.addClass(document.body, themeName);
  //   }
}
