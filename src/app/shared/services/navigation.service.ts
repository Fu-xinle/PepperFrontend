import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

export interface IMenuItem {
  id?: string;
  title?: string;
  description?: string;
  type: string; // Possible values: link/dropDown/extLink
  name?: string; // Used as display text for item and title for separator type
  state?: string; // Router state
  icon?: string; // Material icon name
  tooltip?: string; // Tooltip text
  disabled?: boolean; // If true, item will not be appeared in sidenav.
  sub?: IChildItem[]; // Dropdown items
  badges?: IBadge[];
  active?: boolean;
}
export interface IChildItem {
  id?: string;
  parentId?: string;
  type?: string;
  name: string; // Display text
  state?: string; // Router state
  icon?: string;
  sub?: IChildItem[];
  active?: boolean;
}

interface IBadge {
  color: string; // primary/accent/warn/hex color codes(#fff000)
  value: string; // Display text
}

interface ISidebarState {
  sidenavOpen?: boolean;
  childnavOpen?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  public sidebarState: ISidebarState = {
    sidenavOpen: true,
    childnavOpen: false,
  };
  selectedItem!: IMenuItem;
  defaultMenu: IMenuItem[] = [
    {
      name: '主页',
      description: '网站主页.',
      type: 'dropDown',
      icon: 'icon-Home',
      sub: [
        { icon: 'icon-Home-3', name: '主页', state: '/full/home', type: 'link' },
        {
          icon: 'icon-Map2',
          name: 'Map主页',
          state: '/full/home/home-map',
          type: 'link',
        },
        {
          icon: 'icon-Globe',
          name: 'Earth主页',
          state: '/full/home/home-earth',
          type: 'link',
        },
        {
          icon: 'icon-Bar-Chart',
          name: 'BI主页',
          state: '/full/home/home-bi',
          type: 'link',
        },
        {
          icon: 'icon-Speach-Bubbles',
          name: 'chat主页',
          state: '/full/home/home-chat',
          type: 'link',
        },
        {
          icon: 'icon-Box-withFolders',
          name: '文件管理',
          state: '/full/technology-research/web-crawler',
          type: 'link',
        },
      ],
    },
    {
      name: '系统管理',
      description: '系统管理:.',
      type: 'dropDown',
      icon: 'icon-Data-Settings',
      sub: [
        {
          icon: 'icon-Key',
          name: '用户-角色-权限',
          state: '/full/system-manager/authorize',
          type: 'link',
        },
        {
          icon: 'icon-ID-Card',
          name: '用户信息',
          state: '/full/system-manager/user-info',
          type: 'link',
        },
        {
          icon: 'icon-File-Refresh',
          name: '用户日志',
          state: '/full/system-manager/user-log',
          type: 'link',
        },
        {
          icon: 'icon-Speach-BubbleComic2',
          name: '算法模型',
          state: '/full/system-manager/algorithm-manage',
          type: 'link',
        },
        {
          icon: 'icon-Network-Window',
          name: '流程管理',
          state: '/full/system-manager/flow-manage',
          type: 'link',
        },
        {
          icon: 'icon-Notepad',
          name: '表单管理',
          state: '/full/system-manager/form-manage',
          type: 'link',
        },
      ],
    },
    {
      name: '大数据',
      description: '大数据算法、空间分析算法.',
      type: 'dropDown',
      icon: 'icon-Big-Data',
      sub: [
        {
          icon: 'icon-Geo2-plus',
          name: '空间分析',
          state: '/full/technology-research/spatial-analysis',
          type: 'link',
        },
        {
          icon: 'icon-File-Search',
          name: '全文检索',
          state: '/full/technology-research/relevance-search',
          type: 'link',
        },
        {
          icon: 'icon-Brain-3',
          name: '数据挖掘',
          state: '/full/technology-research/data-mining',
          type: 'link',
        },
        {
          icon: 'icon-Bug',
          name: '爬虫',
          state: '/full/technology-research/web-crawler',
          type: 'link',
        },
      ],
    },
  ];

  // sets iconMenu as default;
  menuItems = new BehaviorSubject<IMenuItem[]>(this.defaultMenu);
  // navigation component has subscribed to this Observable
  menuItems$ = this.menuItems.asObservable();

  // You can customize this method to supply different menu for
  // different user type.
  // publishNavigationChange(menuType: string) {
  //   switch (userType) {
  //     case 'admin':
  //       this.menuItems.next(this.adminMenu);
  //       break;
  //     case 'user':
  //       this.menuItems.next(this.userMenu);
  //       break;
  //     default:
  //       this.menuItems.next(this.defaultMenu);
  //   }
  // }

  constructor() {}
}
