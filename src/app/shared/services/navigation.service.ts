import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { IMenuItem, ISidebarState } from '../interface/shared-layout.interface';
@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  public sidebarState: ISidebarState = {
    sidenavOpen: true,
    childnavOpen: false,
  };
  public selectedItem!: IMenuItem;
  public defaultMenu: IMenuItem[] = [
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
          state: '/full/system-manage/authorize',
          type: 'dropDown',
          sub: [
            {
              icon: 'icon-ID-Card',
              name: '用户信息',
              state: '/full/system-manage/user-info',
              type: 'link',
            },
            {
              icon: 'icon-File-Refresh',
              name: '用户日志',
              state: '/full/system-manage/user-log',
              type: 'link',
            },
          ],
        },
        {
          icon: 'icon-Speach-BubbleComic2',
          name: '地理处理模型',
          state: '/full/system-manage/geoprocessing-model-manage',
          type: 'dropDown',
          sub: [
            {
              icon: 'icon-Network-Window',
              name: '流程管理',
              state: '/full/system-manage/flow-manage',
              type: 'link',
            },
            {
              icon: 'icon-Notepad',
              name: '表单管理',
              state: '/full/system-manage/form-manage',
              type: 'link',
            },
          ],
        },
      ],
    },
    {
      name: '大数据',
      description: '大数据算法、空间分析算法.',
      type: 'dropDown',
      icon: 'icon-Big-Data',
      sub: [
        /*  {
          icon: 'icon-Geo2-plus',
          name: '空间分析',
          state: '/full/technology-research/spatial-analysis',
          type: 'link',
        }, */
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
    {
      name: '其它',
      description: '大数据算法、空间分析算法.',
      icon: 'icon-Big-Data',
      state: '/full/technology-research/spatial-analysis',
      type: 'link',
    },
    {
      name: '百度',
      description: '大数据算法、空间分析算法.',
      icon: 'icon-Big-Data',
      state: 'https://www.baidu.com/',
      type: 'extLink',
    },
  ];

  /**利用Observable,在其它组件动态切换不同的导航栏 */
  public menuItems = new BehaviorSubject<IMenuItem[]>(this.defaultMenu);
  public menuItems$ = this.menuItems.asObservable();

  constructor() {}

  /**
   *不同平台使用不同的主题,切换平台类型,依据用户权限过滤显示的导航菜单
   *
   * @param {string} platformType  Parameter 平台类型名称
   */
  publishNavigationChange(platformType: string) {
    switch (platformType) {
      case 'admin':
        this.menuItems.next(this.defaultMenu);
        break;
      case 'user':
        this.menuItems.next(this.defaultMenu);
        break;
      default:
        this.menuItems.next(this.defaultMenu);
    }
    /** //!依据用户权限过滤显示的导航菜单 预留 */
  }
}
